import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          src?: string;
          poster?: string;
          alt?: string;
          "camera-controls"?: boolean | "";
          "auto-rotate"?: boolean | "";
          "shadow-intensity"?: string;
          exposure?: string;
          loading?: "lazy" | "eager" | "auto";
          ar?: boolean | "";
        },
        HTMLElement
      >;
    }
  }
}

export {};
