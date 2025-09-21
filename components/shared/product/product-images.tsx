"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ProductImages = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div>
      <div className="relative w-full h-[400px]">
        <Image
          src={selectedImage}
          alt="Product Image"
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div className="flex gap-2 mt-2">
        {images.map((image) => (
          <div
            key={image}
            onClick={() => setSelectedImage(image)}
            className={cn(
              "mr-2 cursor-pointer border hover:border-yellow-600",
              {
                "border-yellow-500": selectedImage === image,
              }
            )}
          >
            <Image
              src={image}
              alt="Product Image Thumbnail"
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
