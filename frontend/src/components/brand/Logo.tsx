import Image from "next/image";

interface LogoProps {
  showText?: boolean;
  hideTextOnMobile?: boolean;
  className?: string;
}

export function Logo({
  showText = true,
  hideTextOnMobile = false,
  className = "",
}: LogoProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-medium tracking-tight ${className}`}
    >
      <Image
        src="/logo/logo-mark.svg"
        alt=""
        aria-hidden="true"
        width={32}
        height={32}
        className="size-8 shrink-0"
      />
      {showText && (
        <span
          className={
            hideTextOnMobile ? "hidden whitespace-nowrap sm:inline" : "whitespace-nowrap"
          }
        >
          <span className="text-brand-career">Career</span>
          <span className="text-brand-pilot">Pilot</span>
        </span>
      )}
    </span>
  );
}
