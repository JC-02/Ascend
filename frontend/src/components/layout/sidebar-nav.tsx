'use client';

import { Home, FileText, Video, Settings, TrendingUp } from 'lucide-react';
import { NavItem } from './nav-item';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Resumes', href: '/dashboard/resumes', icon: FileText },
    { name: 'Sessions', href: '/dashboard/sessions', icon: Video },
    { name: 'Progress', href: '/dashboard/progress', icon: TrendingUp },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function SidebarNav() {
    return (
        <nav className="space-y-1" aria-label="Dashboard navigation">
            {navigation.map((item) => (
                <NavItem
                    key={item.name}
                    href={item.href}
                    icon={item.icon}
                    label={item.name}
                />
            ))}
        </nav>
    );
}
