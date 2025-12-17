"use client";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

// Static target date (replace with desired date)
const TARGET_DATE = new Date("2025-12-20T00:59:59");

// Funct to cal the time remaining
const calculateTimeRemaining = (targetDate: Date) => {
  const currentTime = new Date();
  const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0);
  return {
    days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    ),
    minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
  };
};

const DealCountdown = () => {
  const [timeRemaining, setTimeRemaining] =
    React.useState<ReturnType<typeof calculateTimeRemaining>>();

  React.useEffect(() => {
    // Calculate initial time on client
    setTimeRemaining(calculateTimeRemaining(TARGET_DATE));

    const timerInterval = setInterval(() => {
      const newTime = calculateTimeRemaining(TARGET_DATE);
      setTimeRemaining(newTime);

      if (
        newTime.days === 0 &&
        newTime.hours === 0 &&
        newTime.minutes === 0 &&
        newTime.seconds === 0
      ) {
        clearInterval(timerInterval);
      }
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  if (!timeRemaining) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-1 my-20">
        <div className="flex flex-col gap-2 justify-center">
          <h3 className="text-3xl font-bold">Loading Countdown</h3>
        </div>
      </section>
    );
  }

  if (
    timeRemaining.days === 0 &&
    timeRemaining.hours === 0 &&
    timeRemaining.minutes === 0 &&
    timeRemaining.seconds === 0
  ) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 my-20">
        <div className="flex flex-col gap-2 justify-center">
          <h3 className="text-3xl font-bold">Deal Has Ended</h3>
          <p className="text-lg text-muted-foreground">
            This deal is no longer available. Check out our latest promotion
          </p>

          <div className="text-center">
            <Button asChild>
              <Link href="/search">View Products</Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <Image src={"/promo.jpg"} alt="promotion" width={300} height={200} />
        </div>
      </section>
    );
  }
  return (
    <section className="grid grid-cols-1 space-y-4 md:space-y-0 md:grid-cols-2 my-20">
      <div className="flex flex-col gap-2 justify-center">
        <h3 className="text-3xl font-bold">Deal Of The Month</h3>
        <p className="text-lg text-muted-foreground">
          Get ready for a shopping experience like never before with our Deals
          of the month! Every purchase brings you closer to unbeatable discounts
          and exclusive offers. Don&apos;t miss out on these limited-time
          savings!
        </p>

        <ul className="grid grid-cols-4">
          <Starbox label="Days" value={timeRemaining.days} />
          <Starbox label="Hours" value={timeRemaining.hours} />
          <Starbox label="Minutes" value={timeRemaining.minutes} />
          <Starbox label="Seconds" value={timeRemaining.seconds} />
        </ul>

        <div className="text-center">
          <Button asChild>
            <Link href="/search">View Products</Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <Image src={"/promo.jpg"} alt="promotion" width={300} height={200} />
      </div>
    </section>
  );
};

const Starbox = ({ label, value }: { label: string; value: number }) => {
  return (
    <li className="p-4 w-full text-center">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </li>
  );
};

export default DealCountdown;
