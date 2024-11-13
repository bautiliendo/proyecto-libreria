// Admin Dashboard https://tailwindcomponents.com/component/dashboard-12

import { TopMenu } from '@/components';

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* Main Layout content - Contenido principal del Layout */}
            <div className="">
                <TopMenu />
                {/* TODO: Contenido en el Layout.tsx */}
                <div className="px-6 pt-6 bg-white p-2 m-2 rounded">
                    {children}
                </div>
            </div>
        </>
    );
}