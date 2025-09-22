"use client"
import { Input } from "@/components/ui/input"
import { CommandMenu } from "@/components/agent-searchbar"

export function SearchInput() {
  const { dialog, openDialog } = CommandMenu();
  
  return (
    <>
      {dialog}
      <Input 
        onClick={openDialog} 
        placeholder="Search for agents..." 
        readOnly 
        className="cursor-pointer" 
      />
    </>
  );
}