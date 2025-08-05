import { Geo } from "next/font/google";

const geo = Geo({
  weight: ["400"],
  subsets: ["latin"],
});

export const defaultButtonStyle = `${geo.className} px-2 py-2 bg-black text-white-700 font-semibold border-white border hover:bg-white hover:text-black transition cursor-pointer flex gap-2 items-center`;

export const closeButtonStyle = `${geo.className} px-1 py-1 bg-black text-white-700 font-semibold text-red-500 border-red-500 border hover:bg-white transition cursor-pointer flex gap-1 items-center`;
