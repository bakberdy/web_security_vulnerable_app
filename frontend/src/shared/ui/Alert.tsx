interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export function Alert({ type, message, onClose }: AlertProps) {
  const typeStyles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  return (
    <div className={`p-4 rounded-lg border ${typeStyles[type]}`}>
      <div className="flex items-center justify-between">
        <p>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
