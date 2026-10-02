import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GripVertical, Plus, User, X } from "lucide-react";
import SectionFrame from "../components/SectionFrame";
import { Button, Input } from "../components/ui";
import { SLOT_COLORS, SLOTS } from "../data/roster";
import { loadRoster, saveRoster } from "../lib/storage";
import { useToast } from "../lib/toast";

export default function Roster() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [dragging, setDragging] = useState(null);
  const [hoverSlot, setHoverSlot] = useState(null);
  const toast = useToast();

  useEffect(() => {
    setMembers(loadRoster());
    setLoading(false);
  }, []);

  const persist = (next) => {
    setMembers(next);
    saveRoster(next);
  };

  const addMember = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const created = {
      id: crypto.randomUUID(),
      name: trimmed,
      slot: "Substitute",
    };
    persist([...members, created]);
    setName("");
    toast({ title: `${created.name} added to substitutes.` });
  };

  const removeMember = (id) => {
    persist(members.filter((member) => member.id !== id));
  };

  const moveMember = (id, slot) => {
    persist(
      members.map((member) => (member.id === id ? { ...member, slot } : member)),
    );
  };

  const onDrop = (event, slot) => {
    event.preventDefault();
    if (!dragging || dragging.slot === slot) {
      setDragging(null);
      setHoverSlot(null);
      return;
    }
    moveMember(dragging.id, slot);
    setDragging(null);
    setHoverSlot(null);
  };

  const inSlot = (slot) => members.filter((member) => member.slot === slot);

  return (
    <SectionFrame id="roster" label="ROSTER_01" className="bg-background">
      <div className="max-w-5xl mx-auto pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary mb-2">
            PERSONNEL // LINEUP
          </p>
          <h2 className="font-display font-black text-3xl md:text-5xl uppercase tracking-tight text-foreground">
            TEAM ROSTER
          </h2>
          <p className="font-mono text-xs text-muted-foreground mt-2">
            Drag members between slots to set your lineup.
          </p>
        </motion.div>
        <div className="flex gap-2 mb-10 max-w-sm">
          <Input
            placeholder="Add player name..."
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && addMember()}
            className="font-mono text-xs h-9 bg-card"
          />
          <Button
            onClick={addMember}
            size="sm"
            className="font-mono text-[10px] tracking-wider h-9 px-4"
            aria-label="Add player"
          >
            <Plus size={14} />
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SLOTS.map((slot) => (
              <div
                key={slot}
                onDragOver={(event) => {
                  event.preventDefault();
                  setHoverSlot(slot);
                }}
                onDragLeave={() => setHoverSlot(null)}
                onDrop={(event) => onDrop(event, slot)}
                className={`border rounded-none p-4 min-h-[200px] transition-colors ${
                  hoverSlot === slot
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                <div
                  className={`font-mono text-[9px] tracking-[0.25em] uppercase font-bold mb-4 pb-2 border-b ${SLOT_COLORS[slot]} border-current`}
                >
                  {slot}
                  <span className="ml-2 opacity-50">({inSlot(slot).length})</span>
                </div>
                <div className="space-y-2">
                  {inSlot(slot).map((member) => (
                    <div
                      key={member.id}
                      draggable
                      onDragStart={(event) => {
                        setDragging(member);
                        event.dataTransfer.effectAllowed = "move";
                      }}
                      onDragEnd={() => {
                        setDragging(null);
                        setHoverSlot(null);
                      }}
                      className={`flex items-center gap-2 p-2 border border-border bg-background cursor-grab active:cursor-grabbing group hover:border-primary/40 transition-colors ${
                        dragging?.id === member.id ? "opacity-40" : ""
                      }`}
                    >
                      <GripVertical
                        size={12}
                        className="text-muted-foreground shrink-0"
                      />
                      <User size={12} className="text-muted-foreground shrink-0" />
                      <span className="font-mono text-[11px] text-foreground flex-1 truncate">
                        {member.name}
                      </span>
                      <button
                        onClick={() => removeMember(member.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all shrink-0"
                        aria-label={`Remove ${member.name}`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {inSlot(slot).length === 0 ? (
                    <p className="font-mono text-[10px] text-muted-foreground/40 text-center py-4">
                      DROP HERE
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionFrame>
  );
}
