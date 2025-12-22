interface QuickActionProps {
  title: string;
  icon: string;
  path: string;
  color: string;
}

export default function QuickActions({ title, icon, path, color }: QuickActionProps) {
  return (
    <a
      href={path}
      className={`${color} rounded-xl p-4 text-white hover:opacity-90 transition-opacity flex flex-col items-center justify-center text-center`}
    >
      <span className="text-2xl mb-2">{icon}</span>
      <span className="text-sm font-medium">{title}</span>
    </a>
  );
}