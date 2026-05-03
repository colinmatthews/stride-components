import type { ComponentType } from "react";
import LoginPrototype from "./login";

export type Prototype = {
  slug: string;
  title: string;
  description: string;
  Component: ComponentType;
};

export const prototypes: Prototype[] = [
  {
    slug: "login",
    title: "Login",
    description: "Client-side sign-in screen built from shadcn primitives.",
    Component: LoginPrototype,
  },
];

export const prototypeBySlug = (slug: string) => prototypes.find((p) => p.slug === slug);
