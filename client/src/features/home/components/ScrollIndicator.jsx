import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

function ScrollIndicator() {
  return (
    <motion.div
      className="mt-16 flex justify-center"
      animate={{ y: [0, 12, 0] }}
      transition={{
        duration: 1.6,
        repeat: Infinity,
      }}
    >
      <ChevronDown
        size={36}
        className="text-emerald-600 dark:text-emerald-400"
      />
    </motion.div>
  );
}

export default ScrollIndicator;
