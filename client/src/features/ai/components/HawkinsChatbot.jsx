import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Send, X, Trash2, ExternalLink, Loader2, Sparkles } from "lucide-react";

import { askHawkinsAI } from "../aiThunks";
import { clearChat } from "../aiSlice";

// =====================================================
// Markdown Components
// =====================================================

const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
      {children}
    </h1>
  ),

  h2: ({ children }) => (
    <h2 className="mb-3 mt-5 text-lg font-bold text-gray-900 dark:text-white">
      {children}
    </h2>
  ),

  h3: ({ children }) => (
    <h3 className="mb-2 mt-4 text-base font-bold text-gray-900 dark:text-white">
      {children}
    </h3>
  ),

  p: ({ children }) => (
    <p className="mb-3 text-sm leading-6 text-gray-700 last:mb-0 dark:text-gray-300">
      {children}
    </p>
  ),

  ul: ({ children }) => (
    <ul className="mb-3 ml-5 list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="mb-3 ml-5 list-decimal space-y-2 text-sm text-gray-700 dark:text-gray-300">
      {children}
    </ol>
  ),

  li: ({ children }) => <li className="leading-6">{children}</li>,

  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900 dark:text-white">
      {children}
    </strong>
  ),

  em: ({ children }) => <em className="italic">{children}</em>,

  hr: () => <hr className="my-4 border-gray-200 dark:border-gray-700" />,

  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-4 border-green-500 pl-4 italic text-gray-600 dark:text-gray-400">
      {children}
    </blockquote>
  ),

  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-green-600 underline hover:text-green-700"
    >
      {children}
    </a>
  ),

  code: ({ children }) => (
    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-700">
      {children}
    </code>
  ),
};

// =====================================================
// Hawkins Chatbot
// =====================================================

function HawkinsChatbot() {
  const dispatch = useDispatch();

  const { messages, loading } = useSelector((state) => state.ai);

  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");

  const messagesEndRef = useRef(null);

  // ===================================================
  // Auto Scroll
  // ===================================================

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, open]);

  // ===================================================
  // Send Question
  // ===================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    dispatch(askHawkinsAI(trimmedQuestion));

    setQuestion("");
  };

  // ===================================================
  // Enter Key
  // ===================================================

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  // ===================================================
  // Suggestions
  // ===================================================

  const suggestions = [
    "How can I improve soil fertility?",
    "What are common crop diseases?",
    "How should I store harvested crops?",
  ];

  // ===================================================
  // Render
  // ===================================================

  return (
    <>
      {/* =================================================
          Floating Chatbot Button
      ================================================= */}

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="
            fixed
            bottom-6
            right-6
            z-50
            flex
            h-24
            w-24
            items-center
            justify-center
            overflow-hidden
            rounded-full
            border-4
            border-white
            bg-green-600
            shadow-2xl
            transition
            duration-200
            hover:scale-105
            dark:border-gray-800
          "
          aria-label="Open Hawkins Farm AI"
        >
          <img
            src="/hawkins-farm-bot.png"
            alt="Hawkins Farm Bot"
            className="h-full w-full object-cover"
          />

          {/* Online Indicator */}

          <span
            className="
              absolute
              right-1
              top-1
              h-4
              w-4
              rounded-full
              bg-green-400
              ring-2
              ring-white
            "
          />
        </button>
      )}

      {/* =================================================
          Chat Window
      ================================================= */}

      {open && (
        <div
          className="
            fixed
            bottom-5
            right-5
            z-50
            flex
            h-[min(720px,calc(100vh-40px))]
            w-[min(430px,calc(100vw-40px))]
            flex-col
            overflow-hidden
            rounded-3xl
            border
            border-gray-200
            bg-white
            shadow-2xl
            dark:border-gray-700
            dark:bg-gray-900
          "
        >
          {/* =================================================
              Header
          ================================================= */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-gray-200
              bg-green-600
              px-4
              py-4
              text-white
              dark:border-gray-700
            "
          >
            <div className="flex items-center gap-3">
              {/* Bot Image */}

              <div
                className="
                  h-12
                  w-12
                  overflow-hidden
                  rounded-full
                  border-2
                  border-white/70
                  bg-white
                "
              >
                <img
                  src="/hawkins-farm-bot.png"
                  alt="Hawkins Farm Bot"
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-bold">Hawkins Farm Bot</h2>

                  <Sparkles size={15} />
                </div>

                <p className="text-xs text-green-100">
                  Your Smart Farming Assistant
                </p>
              </div>
            </div>

            {/* Header Buttons */}

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => dispatch(clearChat())}
                className="
                  rounded-lg
                  p-2
                  transition
                  hover:bg-green-700
                "
                title="Clear chat"
              >
                <Trash2 size={18} />
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="
                  rounded-lg
                  p-2
                  transition
                  hover:bg-green-700
                "
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* =================================================
              Messages
          ================================================= */}

          <div
            className="
              flex-1
              overflow-y-auto
              bg-gray-50
              p-4
              dark:bg-gray-950
            "
          >
            {/* =================================================
                Welcome Screen
            ================================================= */}

            {messages.length === 0 && (
              <div className="flex min-h-full flex-col items-center justify-center text-center">
                <div
                  className="
                    mb-4
                    h-24
                    w-24
                    overflow-hidden
                    rounded-full
                    border-4
                    border-green-100
                    shadow-lg
                    dark:border-green-900
                  "
                >
                  <img
                    src="/hawkins-farm-bot.png"
                    alt="Hawkins Farm Bot"
                    className="h-full w-full object-cover"
                  />
                </div>

                <h3
                  className="
                    text-xl
                    font-bold
                    text-gray-900
                    dark:text-white
                  "
                >
                  Hello! I'm Hawkins Farm Bot 👋
                </h3>

                <p
                  className="
                    mt-2
                    max-w-xs
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Ask me general questions about farming, crops, soil, markets,
                  government schemes, and more.
                </p>

                {/* Suggestions */}

                <div className="mt-6 w-full space-y-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        dispatch(askHawkinsAI(suggestion));
                      }}
                      className="
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        px-4
                        py-3
                        text-left
                        text-sm
                        text-gray-700
                        transition
                        hover:border-green-400
                        hover:bg-green-50
                        dark:border-gray-700
                        dark:bg-gray-900
                        dark:text-gray-300
                        dark:hover:bg-green-950/30
                      "
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* =================================================
                Chat Messages
            ================================================= */}

            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`
                      max-w-[88%]
                      rounded-2xl
                      px-4
                      py-3
                      ${
                        message.role === "user"
                          ? `
                            rounded-br-md
                            bg-green-600
                            text-white
                          `
                          : `
                            rounded-bl-md
                            bg-white
                            text-gray-800
                            shadow-sm
                            dark:bg-gray-800
                            dark:text-gray-200
                          `
                      }
                    `}
                  >
                    {/* =================================================
                        User Message
                    ================================================= */}

                    {message.role === "user" ? (
                      <p className="whitespace-pre-wrap text-sm leading-6">
                        {message.content}
                      </p>
                    ) : (
                      /* =================================================
                         AI Markdown Message
                      ================================================= */

                      <div className="text-sm leading-6">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={markdownComponents}
                        >
                          {message.content || ""}
                        </ReactMarkdown>
                      </div>
                    )}

                    {/* =================================================
                        Sources
                    ================================================= */}

                    {message.sources?.length > 0 && (
                      <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
                        <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Sources
                        </p>

                        <div className="space-y-2">
                          {message.sources.map((source, index) => (
                            <a
                              key={`${source.url}-${index}`}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="
                                  flex
                                  items-center
                                  justify-between
                                  gap-2
                                  rounded-lg
                                  bg-gray-50
                                  px-3
                                  py-2
                                  text-xs
                                  text-green-700
                                  transition
                                  hover:bg-green-50
                                  dark:bg-gray-900
                                  dark:text-green-400
                                "
                            >
                              <span className="line-clamp-2">
                                {source.title || source.url}
                              </span>

                              <ExternalLink size={14} className="shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* =================================================
                  Loading
              ================================================= */}

              {loading && (
                <div className="flex justify-start">
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-2xl
                      rounded-bl-md
                      bg-white
                      px-4
                      py-3
                      shadow-sm
                      dark:bg-gray-800
                    "
                  >
                    <Loader2
                      size={17}
                      className="animate-spin text-green-600"
                    />

                    <span
                      className="
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Hawkins is thinking...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* =================================================
              Input
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="
              border-t
              border-gray-200
              bg-white
              p-3
              dark:border-gray-700
              dark:bg-gray-900
            "
          >
            <div
              className="
                flex
                items-end
                gap-2
                rounded-2xl
                border
                border-gray-300
                bg-gray-50
                p-2
                focus-within:border-green-500
                dark:border-gray-700
                dark:bg-gray-800
              "
            >
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Hawkins Farm Bot..."
                rows={1}
                disabled={loading}
                className="
                  max-h-28
                  min-h-10
                  flex-1
                  resize-none
                  border-none
                  bg-transparent
                  px-2
                  py-2
                  text-sm
                  text-gray-900
                  outline-none
                  placeholder:text-gray-400
                  dark:text-white
                "
              />

              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-green-600
                  text-white
                  transition
                  hover:bg-green-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>

            <p
              className="
                mt-2
                text-center
                text-[10px]
                text-gray-400
              "
            >
              Hawkins Farm Bot may occasionally make mistakes. Verify important
              information.
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default HawkinsChatbot;
