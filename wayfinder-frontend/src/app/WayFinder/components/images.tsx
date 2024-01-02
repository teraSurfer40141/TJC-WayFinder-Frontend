"use client";
import * as React from "react";
import { Progress } from "@/components/ui/progress";
import { useAtom } from "jotai";
import { presentLocation, goLocation } from "@/atoms";
import Image from "next/image";
import { useState, useEffect } from "react";
import { postMessageAndGetImages } from "./getMap";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Images() {
  const [progress, setProgress] = useState(0);
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedschLocation] = useAtom(presentLocation);
  const [destinationLocation] = useAtom(goLocation);

  useEffect(() => {
    const fetchData = async () => {
      const urls = await postMessageAndGetImages({
        currentLocation: selectedschLocation?.code || "",
        destinationLocation: destinationLocation?.code || "",
      });
      setImageUrls(urls);
    };

    fetchData();
  }, []);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    // Start the progress interval as soon as the component mounts
    progressInterval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(oldProgress + 10, 100);
      });
    }, 1000);

    // Clear the progress interval when the image is loaded
    if (imageUrls.length > 0) {
      setImageLoaded(false);
      clearInterval(progressInterval);
    }

    // Clear the progress interval when the component unmounts
    return () => {
      clearInterval(progressInterval);
    };
  }, [imageUrls]);

  const myLoader = ({ src }: { src: string }) => {
    return src;
  };

  return (
    <>
      <div className="relative">
        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Progress value={progress} />
          </div>
        )}
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {imageUrls.map((imageUrl, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <Image
                    loader={myLoader}
                    src={imageUrl}
                    alt={`Map ${index}`}
                    layout="responsive"
                    width={100}
                    height={100}
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>

      </div>
    </>
  );
}
