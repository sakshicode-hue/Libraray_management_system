import Link from 'next/link';

interface QuickActionProps {
    title: string;
    icon: string;
    path: string;
    color: string;
}

export default function QuickAction({ title, icon, path, color }: QuickActionProps) {
    return (
        <Link
            href={path}
            className={`${color} hover:opacity-90 text-white p-4 rounded-xl shadow-md transition-all transform hover:scale-105 flex flex-col items-center justify-center text-center h-32`}
        >
            <span className="text-3xl mb-2">{icon}</span>
            <span className="font-semibold text-sm">{title}</span>
        </Link>
    );
}
