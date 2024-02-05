import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Code } from "lucide-react";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-neutral p-8">
      <>
        <div className="flex justify-center">
          <Link href="/">
            <Button variant="outline" className="mb-6 text-xs" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Return to console
            </Button>
          </Link>
        </div>
        {children}
      </>
      <div className="flex justify-center">
        <Link href="https://github.com/neallseth/sfc">
          <Button variant="outline" className="mb-6 text-xs" size="sm">
            <Code className="mr-2 h-4 w-4" /> Source
          </Button>
        </Link>
      </div>
    </div>
  );
}
