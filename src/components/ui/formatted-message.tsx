import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface FormattedMessageProps {
  content: string;
  className?: string;
}

export const FormattedMessage = ({ content, className = "" }: FormattedMessageProps) => {
  // Preprocess the content to improve formatting
  const formatContent = (text: string) => {
    // Split long lines into shorter, more readable chunks
    let formatted = text
      // Add line breaks before bullet points
      .replace(/(\*\s)/g, '\n• ')
      // Add line breaks before numbered lists
      .replace(/(\d+\.\s)/g, '\n$1')
      // Add line breaks before sections (words followed by colon)
      .replace(/([A-Z][a-z\s]+:)/g, '\n\n$1')
      // Add line breaks before "Recommendations" or similar headers
      .replace(/(Recommendations?|Limitations?|Summary|Analysis)/g, '\n\n**$1**')
      // Break very long lines (over 80 characters) at natural break points
      .replace(/(.{80,}?)(\s)/g, '$1\n')
      // Clean up multiple line breaks
      .replace(/\n{3,}/g, '\n\n')
      // Trim whitespace
      .trim();

    return formatted;
  };

  const formattedContent = formatContent(content);

  return (
    <div className={`prose prose-sm max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom styling for different elements
          p: ({ children }) => (
            <p className="mb-3 leading-relaxed text-sm">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-muted-foreground">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 ml-4 space-y-1 list-disc">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-4 space-y-1 list-decimal">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-sm leading-relaxed">{children}</li>
          ),
          h1: ({ children }) => (
            <h1 className="text-lg font-bold mb-3 text-foreground">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-semibold mb-2 text-foreground">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-medium mb-2 text-foreground">{children}</h3>
          ),
          code: ({ children }) => (
            <code className="px-1 py-0.5 bg-muted rounded text-xs font-mono">
              {children}
            </code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-muted-foreground pl-4 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-border rounded">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border px-3 py-2 bg-muted text-left text-xs font-medium">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-3 py-2 text-xs">
              {children}
            </td>
          ),
        }}
      >
        {formattedContent}
      </ReactMarkdown>
    </div>
  );
};
