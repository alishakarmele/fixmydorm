/**
 * FixMyDorm - New Complaint Page
 *
 * Wraps the ComplaintForm component in the protected layout.
 */

import { ComplaintForm } from "@/components/complaints/complaint-form";

export default function NewComplaintPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <ComplaintForm />
    </div>
  );
}
