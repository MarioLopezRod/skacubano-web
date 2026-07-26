"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import BowloramaText from "../BowloramaText";

export default function MembersGrid({ integrantes = [], fotos = [], onSelectMember }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {integrantes.map((member, index) => {
        const memberPhotos = fotos.filter((f) => f.integranteId === member.id);
        const profileImg = member.fotoPrincipalUrl || (memberPhotos[0]?.url) || "/images/photos/bio_portrait_natty.jpg";

        return (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.04 }}
            onClick={() => onSelectMember(member.id)}
            className="group relative cursor-pointer flex flex-col justify-between rounded-2xl bg-[#14100c] border-2 border-yellow-500/30 shadow-[0_10px_25px_rgba(0,0,0,0.8)] overflow-hidden hover:border-yellow-400 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(250,204,21,0.25)]"
          >
            {/* Header Image Frame */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-black p-2">
              <div className="relative w-full h-full overflow-hidden rounded-lg border border-yellow-400/20">
                <Image
                  src={profileImg}
                  alt={member.nombre}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14100c] via-black/30 to-transparent" />
              </div>
            </div>

            {/* Member Info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bebas text-3xl text-yellow-400 tracking-wider uppercase drop-shadow group-hover:text-yellow-300 transition-colors leading-none mb-1">
                  {member.nombre}
                </h3>
                <p className="text-xs font-mono font-bold text-amber-200/80 tracking-wider uppercase mb-2">
                  {member.rol}
                </p>
                <p className="text-xs font-sans text-amber-100/75 line-clamp-3 leading-relaxed">
                  {member.bio || "Integrante fundamental de Ska Cubano."}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
