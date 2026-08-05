import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

function ScrollIndicator() {
  return (
    <motion.div
      className="flex justify-center mt-16"
      animate={{ y: [0, 12, 0] }}
      transition={{
        duration: 1.6,
        repeat: Infinity,
      }}
    >
      <ChevronDown size={36} className="text-emerald-600" />
    </motion.div>
  );
}

export default ScrollIndicator;
