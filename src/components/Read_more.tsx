import { memo, useState } from "react";

const ReadMore = memo(
  ({ content, maxLength }: { content: string; maxLength: number }) => {
    const [readMore, setReadMore] = useState<boolean>(false);

    return content.length < maxLength ? (
      content
    ) : (
      <>
        {content.slice(0, maxLength)} {!readMore && "..."}
        {readMore && (
          <span className="animate-fade-in">{content.slice(maxLength)}</span>
        )}
        <button
          aria-label={readMore ? "read less" : "read more"}
          onClick={() => setReadMore((state) => !state)}
          className="underline text-sm md:text-base"
        >
          {readMore ? "read less" : "read more"}
        </button>
      </>
    );
  }
);

export default ReadMore;
