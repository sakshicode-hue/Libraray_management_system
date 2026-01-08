"use client";
import React, { useState, useEffect } from "react";
import { BookOpenText } from "lucide-react";
import Image from "next/image";

export type image = {
    id: (number | string)
    image_url?: string
}
const bookColors = [
    "bg-book-1",
    "bg-book-2",
    "bg-book-3",
    "bg-book-4",
    "bg-book-5",
    "bg-book-6",
    "bg-book-7",
    "bg-book-8",
    "bg-book-9",
];

export const ProductImageCell: React.FC<image> = ({ id, image_url }) => {
    const [color, setColor] = useState<string>("bg-book-1");
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * bookColors.length);
        setColor(bookColors[randomIndex]);
    }, []);

    if (image_url) {
        return (
            <div className="h-50 w-full relative rounded-t-md overflow-hidden bg-gray-100 flex items-center justify-center">
                <Image
                    src={image_url}
                    alt={`Book cover for ${id}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
        )
    }

    return (
        <div data-id={id} className={`${color} h-50  rounded-t-md flex items-center justify-center`}>
            <BookOpenText className={` ${color == "bg-book-6" || color == "bg-book-1" ? "text-black" : "text-white"}`} size={120} />
        </div>
    );
};
