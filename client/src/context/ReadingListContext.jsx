import { createContext, useContext, useReducer, useEffect } from "react";

const ReadingListContext = createContext(null);

const STORAGE_KEY = "readingList";

function getInitialState() {
  try {
    const savedList = localStorage.getItem(STORAGE_KEY);
    return savedList ? JSON.parse(savedList) : [];
  } catch {
    return [];
  }
}

function readingListReducer(state, action) {
  switch (action.type) {
    case "ADD_BOOK": {
      const book = action.payload;

      // Prevent duplicate books
      const exists = state.some((item) => item.id === book.id);

      if (exists) {
        return state;
      }

      return [...state, book];
    }

    case "REMOVE_BOOK":
      return state.filter((book) => book.id !== action.payload);

    case "CLEAR_LIST":
      return [];

    default:
      return state;
  }
}

export function ReadingListProvider({ children }) {
  const [readingList, dispatch] = useReducer(
    readingListReducer,
    undefined,
    getInitialState
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readingList));
  }, [readingList]);

  const addBook = (book) => {
    dispatch({ type: "ADD_BOOK", payload: book });
  };

  const removeBook = (bookId) => {
    dispatch({ type: "REMOVE_BOOK", payload: bookId });
  };

  const clearList = () => {
    dispatch({ type: "CLEAR_LIST" });
  };

  return (
    <ReadingListContext.Provider
      value={{ readingList, addBook, removeBook, clearList }}
    >
      {children}
    </ReadingListContext.Provider>
  );
}

export function useReadingList() {
  const context = useContext(ReadingListContext);

  if (!context) {
    throw new Error(
      "useReadingList must be used within a ReadingListProvider"
    );
  }

  return context;
}
