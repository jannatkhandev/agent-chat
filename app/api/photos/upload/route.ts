import { NextRequest, NextResponse } from 'next/server';
import { S3Client, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand, AbortMultipartUploadCommand, ListPartsCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getImageDatabase, setImageDatabase } from '../gallery/route';

interface CachedClient {
  client: S3Client;
  lastUsed: number;
}

const S3_CLIENT_CACHE: { [key: string]: CachedClient } = {};
const CACHE_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

function getS3Client(bucketName: string): S3Client {
  const now = Date.now();

  // Clean up expired cache entries
  Object.keys(S3_CLIENT_CACHE).forEach(key => {
    if (now - S3_CLIENT_CACHE[key].lastUsed > CACHE_EXPIRY_MS) {
      delete S3_CLIENT_CACHE[key];
    }
  });

  // Return cached client if available
  if (S3_CLIENT_CACHE[bucketName]) {
    S3_CLIENT_CACHE[bucketName].lastUsed = now;
    return S3_CLIENT_CACHE[bucketName].client;
  }

  // Create new client if not in cache
  const accessKeyId = process.env[`${bucketName.toUpperCase()}_ACCESS_KEY_ID`];
  const secretAccessKey = process.env[`${bucketName.toUpperCase()}_SECRET_ACCESS_KEY`];
  
  if (!accessKeyId || !secretAccessKey) {
    throw new Error(`Missing credentials for bucket: ${bucketName}`);
  }

  const newClient = new S3Client({
    region: "auto",
    endpoint: "https://a549762b7ab37dfa8434aceb53c060e1.r2.cloudflarestorage.com",
    credentials: { accessKeyId, secretAccessKey },
  });

  S3_CLIENT_CACHE[bucketName] = { client: newClient, lastUsed: now };
  return newClient;
}

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileType, partNumber, uploadId, bucketName, action } = await req.json();
    
    if (!bucketName) {
      return NextResponse.json({ error: 'Bucket name is required' }, { status: 400 });
    }

    const s3Client = getS3Client(bucketName);
    
    if (action === 'getETag') {
      // Retrieve ETag for a specific part
      const listPartsCommand = new ListPartsCommand({
        Bucket: bucketName,
        Key: fileName,
        UploadId: uploadId,
        PartNumberMarker: (partNumber - 1).toString(),
        MaxParts: 1
      });

      const listPartsResponse = await s3Client.send(listPartsCommand);
      const part = listPartsResponse.Parts?.[0];

      if (!part || part.PartNumber !== partNumber) {
        return NextResponse.json({ error: 'Part not found' }, { status: 404 });
      }

      return NextResponse.json({ ETag: part.ETag });
    }

    if (!uploadId) {
      const createCommand = new CreateMultipartUploadCommand({
        Bucket: bucketName,
        Key: fileName,
        ContentType: fileType,
      });
      const { UploadId } = await s3Client.send(createCommand);
      return NextResponse.json({ uploadId: UploadId });
    } else {
      const uploadPartCommand = new UploadPartCommand({
        Bucket: bucketName,
        Key: fileName,
        UploadId: uploadId,
        PartNumber: partNumber,
      });
      const signedUrl = await getSignedUrl(s3Client, uploadPartCommand, { expiresIn: 60 });
      return NextResponse.json({ signedUrl });
    }
  } catch (error) {
    console.error('Error in upload API:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { fileName, uploadId, parts, bucketName } = await req.json();
    
    if (!bucketName) {
      return NextResponse.json({ error: 'Bucket name is required' }, { status: 400 });
    }

    const s3Client = getS3Client(bucketName);
    
    const completeCommand = new CompleteMultipartUploadCommand({
      Bucket: bucketName,
      Key: fileName,
      UploadId: uploadId,
      MultipartUpload: { 
        Parts: parts.map(part => ({
          ETag: part.ETag,
          PartNumber: part.PartNumber
        }))
      },
    });
    
    const result = await s3Client.send(completeCommand);

    // Add the uploaded image to moderation queue
    const imageDatabase = getImageDatabase();
    const imageUrl = `https://storage.infidrive.net/${fileName}`;
    const newImage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: imageUrl,
      fileName: fileName,
      uploadedAt: new Date().toISOString(),
      status: 'pending' as const
    };

    imageDatabase.push(newImage);
    setImageDatabase(imageDatabase);

    return NextResponse.json({
      message: 'Upload completed successfully',
      result: result,
      imageId: newImage.id
    });
  } catch (error) {
    console.error('Error completing multipart upload:', error);
    return NextResponse.json({ error: 'Failed to complete upload' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { fileName, uploadId, bucketName } = await req.json();
    
    if (!bucketName) {
      return NextResponse.json({ error: 'Bucket name is required' }, { status: 400 });
    }

    const s3Client = getS3Client(bucketName);
    
    const abortCommand = new AbortMultipartUploadCommand({
      Bucket: bucketName,
      Key: fileName,
      UploadId: uploadId,
    });
    
    await s3Client.send(abortCommand);
    return NextResponse.json({ message: 'Upload aborted successfully' });
  } catch (error) {
    console.error('Error aborting multipart upload:', error);
    return NextResponse.json({ error: 'Failed to abort upload' }, { status: 500 });
  }
}
