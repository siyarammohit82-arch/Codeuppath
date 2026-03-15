import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api, type WaitlistInput } from "@shared/routes";
import { useJoinWaitlist } from "@/hooks/use-waitlist";

interface WaitlistFormProps {
  className?: string;
  buttonText?: string;
}

export function WaitlistForm({ className = "", buttonText = "Join Waitlist" }: WaitlistFormProps) {
  const mutation = useJoinWaitlist();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WaitlistInput>({
    resolver: zodResolver(api.waitlist.create.input),
  });

  const onSubmit = (data: WaitlistInput) => {
    mutation.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <div className={`w-full max-w-md ${className}`}>
      <AnimatePresence mode="wait">
        {mutation.isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center p-4 glass-card rounded-2xl text-cyan-400 border-cyan-500/30"
          >
            <CheckCircle2 className="w-6 h-6 mr-3" />
            <span className="font-medium font-display text-lg">You're on the list! Keep an eye on your inbox.</span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit(onSubmit)}
            className="relative"
          >
            <div className="relative flex items-center group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl blur opacity-30 group-focus-within:opacity-60 transition duration-500"></div>
              <div className="relative flex w-full bg-background/80 backdrop-blur-sm rounded-2xl border border-white/10 p-1.5 focus-within:border-cyan-400/50 transition-colors">
                <input
                  {...register("email")}
                  type="email"
                  disabled={isSubmitting || mutation.isPending}
                  placeholder="Enter your email address..."
                  className="flex-1 bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 font-sans"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || mutation.isPending}
                  className="flex items-center justify-center px-6 py-3 ml-2 font-display font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 transition-all"
                >
                  {(isSubmitting || mutation.isPending) ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {buttonText}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Error Message */}
            <AnimatePresence>
              {(errors.email || mutation.isError) && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-8 left-4 text-sm text-destructive font-medium"
                >
                  {errors.email?.message || mutation.error?.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
