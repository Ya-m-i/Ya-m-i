"use client";

import React, { useState } from "react";
import { GithubIcon, InstagramIcon, LinkedinIcon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import { withBasePath } from "@/lib/base-path";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function UpworkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zM6.563 13.158c-1.49 0-2.702-1.213-2.702-2.704 0-1.49 1.213-2.702 2.702-2.702.637 0 1.235.22 1.704.619.075-.332.15-.636.23-.924.078-.289.154-.559.23-.806.226-.76.396-1.331.496-1.709-.976-1.448-2.405-2.34-4.061-2.34-2.531 0-4.583 2.052-4.583 4.583 0 2.53 2.052 4.582 4.583 4.582 2.469 0 4.526-1.943 4.576-4.378-.024.018-.053.034-.078.053zm6.295-.703c.024.258.037.517.037.782 0 .154-.008.308-.02.461-.012.152-.027.306-.047.461-.033.302-.073.605-.119.909h-2.924c.058-.305.104-.609.139-.909.036-.308.063-.616.081-.924.018-.308.027-.616.027-.924 0-.265-.013-.524-.037-.782-.024-.258-.054-.516-.09-.774-.036-.258-.078-.516-.126-.774-.048-.258-.102-.516-.162-.774h2.883c-.06.258-.114.516-.162.774-.048.258-.09.516-.126.774-.036.258-.066.516-.09.774zm2.882-2.627c-.048-.258-.09-.516-.126-.774-.036-.258-.066-.516-.09-.774-.024-.258-.037-.517-.037-.782 0-.308.009-.616.027-.924.018-.308.045-.616.081-.924.035-.3.081-.604.139-.909h2.924c-.046.304-.086.607-.119.909-.02.155-.035.309-.047.461-.012.153-.02.307-.02.461 0 .265.013.524.037.782.024.258.054.516.09.774.036.258.078.516.126.774.048.258.102.516.162.774h-2.883c.06-.258.114-.516.162-.774zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/Ya-m-i",
    icon: GithubIcon,
    image: withBasePath("/images/scanImages/Github.png"),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/kyzz.1z/",
    icon: InstagramIcon,
    image: withBasePath("/images/scanImages/Insta.png"),
  },
  {
    label: "Discord",
    href: "https://discord.com/channels/@me",
    icon: "discord",
    image: withBasePath("/images/scanImages/Discord.png"),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: LinkedinIcon,
    image: withBasePath("/images/scanImages/Github.png"), // Fallback
  },
  {
    label: "Upwork",
    href: "https://www.upwork.com/freelancers/~0161970396e75c1d53",
    icon: "upwork",
    image: withBasePath("/images/scanImages/Upwork.png"),
  },
] as const;

function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeScanImage, setActiveScanImage] = useState(SOCIAL_LINKS[0].image);

  const activeLink = SOCIAL_LINKS.find((link) => link.image === activeScanImage) || SOCIAL_LINKS[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      _subject: "New Message from Portfolio!",
      _captcha: "false"
    };

    try {
      const response = await fetch("https://formsubmit.co/ajax/kycirshanepacon@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Error sending message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-center",
        "overflow-hidden bg-black py-20 md:py-28"
      )}
    >
      {/* Background text: CONTACT ME */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <span
          className="select-none text-[clamp(4rem,18vw,14rem)] font-bold tracking-tighter text-white/3"
          style={{ lineHeight: 1 }}
        >
          CONTACT ME
        </span>
      </div>

      <div className="relative z-10 flex w-full flex-col items-center justify-center px-4">
        <h2 className="font-[family-name:var(--font-orbitron)] mb-12 text-center text-3xl font-semibold text-white sm:text-4xl md:mb-16">
          Contact
        </h2>

        <div className="flex w-full max-w-5xl flex-col gap-16 lg:flex-row lg:items-center lg:justify-between">
          {/* Left Split: Scan Image & Socials */}
          <div className="flex w-full flex-col items-center lg:w-1/2">
            <h3 className="mb-8 text-xl font-medium text-white/90">Connect Across Platforms</h3>
            <div className="mb-4 flex aspect-square w-[380px] max-w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl pointer-events-none transition-all duration-300">
              <div className="relative h-full w-full">
                <Image 
                  key={activeScanImage}
                  src={activeScanImage} 
                  alt={`Scan ${activeLink.label}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-contain rounded-xl animate-in fade-in zoom-in-95 duration-300"
                />
              </div>
            </div>
            
            <p 
              key={`${activeLink.label}-label`}
              className="mb-8 text-sm font-medium tracking-wide text-white/60 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              Scan <span className="text-white/90 font-semibold">{activeLink.label}</span> QR
            </p>
            
            {/* Social links */}
            <TooltipProvider delayDuration={100}>
              <div className="flex flex-wrap justify-center gap-6">
                {SOCIAL_LINKS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeScanImage === item.image;
                  return (
                    <Tooltip key={item.label}>
                      <TooltipTrigger asChild>
                        <a
                          href={item.href}
                          target={item.href !== "#" ? "_blank" : undefined}
                          rel={item.href !== "#" ? "noopener noreferrer" : undefined}
                          onClick={(e) => {
                            if (!isActive) {
                              e.preventDefault();
                              setActiveScanImage(item.image);
                            }
                          }}
                          aria-label={item.label}
                          className={cn(
                            "flex items-center justify-center rounded-full p-3.5 transition-all hover:scale-110 active:scale-95",
                            isActive 
                              ? "bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)] ring-1 ring-white/30" 
                              : "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          {typeof Icon === "string" ? (
                            Icon === "discord" ? (
                              <DiscordIcon className="size-6" />
                            ) : (
                              <UpworkIcon className="size-6" />
                            )
                          ) : (
                            <Icon className="size-6" />
                          )}
                        </a>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="bottom" 
                        sideOffset={8}
                        className="rounded border border-white/10 bg-neutral-900/90 backdrop-blur-sm text-white px-3 py-1.5 text-sm font-medium shadow-2xl"
                      >
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          </div>

          {/* Right Split: Contact Form */}
          <div className="flex w-full flex-col lg:w-1/2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm sm:p-10 min-h-[500px] flex flex-col justify-center">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center fade-in animate-in duration-500">
                  <CheckCircle2 className="size-16 text-green-500 mb-4" />
                  <h4 className="text-2xl font-semibold text-white">Message Sent!</h4>
                  <p className="text-white/70">
                    Thank you for reaching out. I'll get back to you as soon as possible via email.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-8 rounded-md border border-white/20 px-6 py-2.5 text-sm font-medium text-white/90 transition-all hover:bg-white/10"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="mb-8 text-2xl font-semibold text-white">Send a Message</h3>
                  <form className="grid gap-6" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                      <Label htmlFor="contact-name" className="text-white/90">
                        Name
                      </Label>
                      <Input
                        id="contact-name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        required
                        disabled={isSubmitting}
                        className="border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-white/30 h-11"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contact-email" className="text-white/90">
                        Email
                      </Label>
                      <Input
                        id="contact-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        disabled={isSubmitting}
                        className="border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-white/30 h-11"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contact-message" className="text-white/90">
                        Message
                      </Label>
                      <Textarea
                        id="contact-message"
                        name="message"
                        placeholder="Your message..."
                        rows={5}
                        required
                        disabled={isSubmitting}
                        className="min-h-[120px] border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-white/30 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-4 w-full flex items-center justify-center rounded-md bg-white px-4 py-3 text-sm font-semibold text-black transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Contact };
export default Contact;
