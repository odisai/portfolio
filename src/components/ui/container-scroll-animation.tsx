"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "motion/react";

export const ContainerScroll = ({
  titleComponent,
  children,
  variant = "tablet",
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
  variant?: "tablet" | "iphone";
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="h-240 md:h-320 flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-40 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        {variant === "iphone" ? (
          <IPhoneCard rotate={rotate} translate={translate} scale={scale}>
            {children}
          </IPhoneCard>
        ) : (
          <Card rotate={rotate} translate={translate} scale={scale}>
            {children}
          </Card>
        )}
      </div>
    </div>
  );
};

interface HeaderProps {
  translate: MotionValue<number>;
  titleComponent: React.ReactNode;
}

export const Header = ({ translate, titleComponent }: HeaderProps) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl -mt-12 mx-auto h-120 md:h-160 w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl md:p-4">
        {children}
      </div>
    </motion.div>
  );
};

export const IPhoneCard = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
      }}
      className="max-w-[320px] md:max-w-[380px] -mt-12 mx-auto aspect-[9/19.5] w-full relative"
    >
      {/* Ambient screen glow */}
      <div
        className="absolute -inset-[30%] rounded-full opacity-[0.07] blur-[80px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, #0A84FF 0%, #0A84FF 30%, transparent 70%)",
        }}
      />

      {/* iPhone outer shell — titanium black */}
      <div
        className="absolute inset-0 rounded-[52px] md:rounded-[58px]"
        style={{
          background:
            "linear-gradient(145deg, #2a2a2e 0%, #1c1c1e 50%, #151517 100%)",
          boxShadow: `
            inset 0 0.5px 0 rgba(255,255,255,0.08),
            inset 0 -0.5px 0 rgba(0,0,0,0.5),
            0 0 0 0.5px rgba(255,255,255,0.05),
            0 2px 8px rgba(0,0,0,0.4),
            0 12px 40px rgba(0,0,0,0.5),
            0 40px 80px rgba(0,0,0,0.4)
          `,
        }}
      />

      {/* Titanium edge highlight — top */}
      <div className="absolute top-0 left-[20%] right-[20%] h-px bg-linear-to-r from-transparent via-white/12 to-transparent rounded-full" />

      {/* Side buttons — left: silent switch + volume */}
      <div
        className="absolute -left-[2.5px] top-[18%] w-[3px] h-[4%] rounded-l-sm"
        style={{
          background: "linear-gradient(180deg, #3a3a3e, #2a2a2e, #1a1a1e)",
          boxShadow:
            "inset 0 0.5px 0 rgba(255,255,255,0.1), -1px 0 2px rgba(0,0,0,0.3)",
        }}
      />
      <div
        className="absolute -left-[2.5px] top-[26%] w-[3px] h-[7%] rounded-l-sm"
        style={{
          background: "linear-gradient(180deg, #3a3a3e, #2a2a2e, #1a1a1e)",
          boxShadow:
            "inset 0 0.5px 0 rgba(255,255,255,0.1), -1px 0 2px rgba(0,0,0,0.3)",
        }}
      />
      <div
        className="absolute -left-[2.5px] top-[35%] w-[3px] h-[7%] rounded-l-sm"
        style={{
          background: "linear-gradient(180deg, #3a3a3e, #2a2a2e, #1a1a1e)",
          boxShadow:
            "inset 0 0.5px 0 rgba(255,255,255,0.1), -1px 0 2px rgba(0,0,0,0.3)",
        }}
      />

      {/* Side button — right: power */}
      <div
        className="absolute -right-[2.5px] top-[28%] w-[3px] h-[10%] rounded-r-sm"
        style={{
          background: "linear-gradient(180deg, #3a3a3e, #2a2a2e, #1a1a1e)",
          boxShadow:
            "inset 0 0.5px 0 rgba(255,255,255,0.1), 1px 0 2px rgba(0,0,0,0.3)",
        }}
      />

      {/* Screen bezel — the actual display cutout */}
      <div
        className="absolute inset-[3.5%] rounded-[44px] md:rounded-[48px] overflow-hidden"
        style={{
          boxShadow:
            "inset 0 0 0 0.5px rgba(0,0,0,0.8), inset 0 0 8px rgba(0,0,0,0.5)",
        }}
      >
        {/* Screen glass layer */}
        <div className="absolute inset-0 bg-black" />

        {/* Dynamic Island */}
        <div className="absolute top-[1.5%] left-1/2 -translate-x-1/2 z-30">
          <div
            className="w-[90px] md:w-[110px] h-[28px] md:h-[32px] bg-black rounded-full flex items-center justify-center relative"
            style={{
              boxShadow: "0 0 0 0.5px rgba(255,255,255,0.04)",
            }}
          >
            {/* Camera lens */}
            <div className="absolute right-[18%] w-[8px] h-[8px] md:w-[10px] md:h-[10px] rounded-full bg-[#0c0c10] border border-[#1a1a20]">
              <div className="absolute inset-[2px] rounded-full bg-[#0f0f15] border border-[#252530]">
                <div className="absolute top-px left-px w-[2px] h-[2px] rounded-full bg-[#2a2a40]/40" />
              </div>
            </div>
          </div>
        </div>

        {/* Screen content — clipped to screen bounds */}
        <div className="relative h-full w-full overflow-hidden">{children}</div>

        {/* Home indicator */}
        <div className="absolute bottom-[1.2%] left-1/2 -translate-x-1/2 z-30">
          <div className="w-[100px] md:w-[120px] h-[4px] bg-white/15 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
};
