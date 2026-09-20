/**
 * FixMyDorm - New Complaint Page
 *
 * Wraps the ComplaintForm component in the protected layout.
 */

import { Suspense } from "react";
import { ComplaintForm } from "@/components/complaints/complaint-form";

export default function NewComplaintPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading form...</div>}>
        <ComplaintForm />
      </Suspense>
    </div>
  );
}
