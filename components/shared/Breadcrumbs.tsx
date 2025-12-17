import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

const Breadcrumbs = ({
  name,
  category,
}: {
  name: string;
  category: string;
}) => {
  // Truncate text if it's longer than specified word count
  const truncateText = (text: string, maxWords: number) => {
    const words = text.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    return text;
  };

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-wrap">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="max-w-[120px] sm:max-w-none">
          <BreadcrumbLink
            href={`/search?category=${category}`}
            className="block truncate"
            title={category}
          >
            {truncateText(category, 8)}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="max-w-[120px] sm:max-w-none">
          <BreadcrumbPage className="block truncate" title={name}>
            {truncateText(name, 8)}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
