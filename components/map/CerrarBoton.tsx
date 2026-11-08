type Props = {
  onClick: () => void;
  label: string;
  className?: string;
};

// Small, consistent close affordance for map panels and callouts.
export default function CerrarBoton({ onClick, label, className = "" }: Props) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      aria-label={label}
      title={label}
      className={`inline-flex h-7 w-7 flex-none cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-ink ${className}`}
    >
      <svg
        viewBox="0 0 16 16"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M4 4l8 8M12 4l-8 8" />
      </svg>
    </button>
  );
}
