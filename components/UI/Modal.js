import { useRouter } from "next/router";

export default function Modal({ isOpen, onClose, children }) {
  const router = useRouter();

  const handleClose = () => {
    router.push(router.pathname, undefined, { shallow: true });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="poppins fixed inset-0 opacity-100 z-[99999999999999999999999] flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-auto">
      <div className="relative w-full max-w-md z-[99999999999999999999999] md:max-w-lg lg:max-w-[75vw] xl:max-w-[50vw] bg-white rounded-lg shadow-lg py-6 md:p-6 max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-2 z-[99999999999999999]  right-2 text-gray-500 hover:text-black hover:bg-gray-300 bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full"
          onClick={handleClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
