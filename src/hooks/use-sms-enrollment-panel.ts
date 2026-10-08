import { useState } from "react";

export function useSmsEnrollmentPanel() {
  const [enrolled, setEnrolled] = useState(false);

  return { enrolled, markEnrolled: () => setEnrolled(true) };
}
