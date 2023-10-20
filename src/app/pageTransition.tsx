'use client'
import { motion } from 'framer-motion';

export default function PageTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            {children}
        </motion.div>
    )
}