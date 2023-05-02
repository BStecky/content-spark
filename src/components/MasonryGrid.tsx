import React from "react";
import Masonry from "react-masonry-css";
import ContentCard from "./ContentCard";

interface Content {
  id: string;
  userId: string;
  contentType: string;
  content: string;
  createdAt: Date;
}

interface MasonryGridProps {
  content: Array<Content>;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ content }) => {
  const breakpointColumnsObj = {
    default: 4,
    1500: 3,
    1100: 2,
    600: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex flex-row"
      columnClassName=""
    >
      {content.map((item) => (
        <div className="mb-8" key={item.id}>
          <ContentCard content={item} />
        </div>
      ))}
    </Masonry>
  );
};

export default MasonryGrid;
