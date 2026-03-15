import { useMutation } from "@tanstack/react-query";
import { api, type WaitlistInput, type WaitlistResponse } from "@shared/routes";

export function useJoinWaitlist() {
  return useMutation<WaitlistResponse, Error, WaitlistInput>({
    mutationFn: async (data) => {
      // Use exact path and method from the shared routes manifest
      const res = await fetch(api.waitlist.create.path, {
        method: api.waitlist.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        // Attempt to parse the structured error from our API contract
        let errorMessage = "Failed to join waitlist. Please try again.";
        try {
          const errorData = await res.json();
          // Safe parsing of the validation/internal error schema
          const parsedError = api.waitlist.create.responses[400].safeParse(errorData);
          if (parsedError.success) {
            errorMessage = parsedError.data.message;
          } else {
            errorMessage = errorData.message || errorMessage;
          }
        } catch (e) {
          // Fallback if response isn't JSON
        }
        throw new Error(errorMessage);
      }

      // Parse and return the successful response
      const json = await res.json();
      return api.waitlist.create.responses[201].parse(json);
    },
  });
}
