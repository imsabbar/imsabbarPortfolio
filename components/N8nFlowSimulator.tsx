'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Dictionary } from '@/types/dictionary';
import { BoltIcon } from '@/components/icons';
import { Modal } from '@/components/ui/Modal';
import type { N8nNode } from '@/types/portfolio';
import { trackEvent } from '@/lib/analytics';

interface N8nFlowSimulatorProps {
  dict: Dictionary;
  /** Phase 2: DB-driven nodes from the featured case study's `n8n_nodes_json`. */
  nodes: N8nNode[];
}

const STEP_INTERVAL_MS = 1000;
const FINAL_HOLD_MS = 1200;

export function N8nFlowSimulator({ dict, nodes: nodesProp }: N8nFlowSimulatorProps) {
  // The parent only mounts this component when nodes exist; treat them as the
  // source of truth (no sample-data fallback in production — PRD §4.8/§6.3).
  const [nodes] = useState<N8nNode[]>(nodesProp);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [activeNodeIndex, setActiveNodeIndex] = useState<number | null>(null);
  const [selectedNode, setSelectedNode] = useState<N8nNode | null>(null);

  // P3.3 — `prefers-reduced-motion` collapses the run animation into a
  // single static "all passed" state.
  const reducedMotion = useReducedMotion() ?? false;

  const runSimulation = () => {
    if (isRunning || isComplete) return;

    trackEvent('n8n_simulator_play', { node_count: nodes.length });

    if (reducedMotion) {
      setIsRunning(false);
      setIsComplete(true);
      setActiveNodeIndex(null);
      return;
    }

    setIsRunning(true);
    setIsComplete(false);
    setActiveNodeIndex(0);

    nodes.forEach((_, idx) => {
      setTimeout(() => {
        setActiveNodeIndex(idx);
        if (idx === nodes.length - 1) {
          setTimeout(() => {
            setIsRunning(false);
            setIsComplete(true);
            setActiveNodeIndex(null);
          }, FINAL_HOLD_MS);
        }
      }, idx * STEP_INTERVAL_MS);
    });
  };

  // When reduced motion is on, every node is visually "passed" from the start.
  const reducedView = reducedMotion && isComplete;

  return (
    <div className="my-12 p-6 sm:p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-strong)] shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
        <div>
          <div className="kicker mb-1">{dict.simulator.kicker}</div>
          <h3 className="font-display font-bold text-xl text-[var(--color-text)]">{dict.simulator.title}</h3>
          <p className="font-body text-xs text-[var(--color-text-muted)]">{dict.simulator.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={runSimulation}
            disabled={isRunning}
            aria-label={isComplete ? dict.common.demo_complete : dict.simulator.tap_to_play}
            className="btn btn-primary btn-sm"
          >
            <BoltIcon className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>
              {isRunning ? dict.common.running : isComplete ? dict.common.demo_complete : dict.simulator.tap_to_play}
            </span>
          </button>
          <span className="data-chip text-[var(--color-text-muted)]">n8n v1.40</span>
        </div>
      </div>

      {/* Nodes — desktop (sm and up): horizontal flow with 1px connectors (§4.5).
          Mobile (<sm): the connectors are dropped; layout becomes a vertical
          stacked list per the static mobile diagram requirement (§4.10). */}
      <ol
        className="hidden sm:grid grid-cols-1 md:grid-cols-4 gap-4 relative"
        aria-label={dict.simulator.kicker}
      >
        {nodes.map((node, index) => (
          <N8nNodeCard
            key={node.id}
            node={node}
            index={index}
            isActive={activeNodeIndex === index}
            isPassed={activeNodeIndex !== null && activeNodeIndex > index}
            isCompletedFinal={isComplete || reducedView}
            isLast={index === nodes.length - 1}
            onClick={() => setSelectedNode(node)}
            dict={dict}
          />
        ))}
      </ol>

      {/* Mobile diagram (§4.10) */}
      <ol
        className="sm:hidden space-y-2 font-mono text-sm"
        aria-label={dict.simulator.kicker}
      >
        {nodes.map((n, i) => {
          const isNodeActive = activeNodeIndex === i;
          const isNodePassed = activeNodeIndex !== null && activeNodeIndex > i;
          const isDone = isComplete || reducedView;
          return (
            <li
              key={n.id}
              onClick={() => setSelectedNode(n)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                isNodeActive
                  ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : isNodePassed || isDone
                    ? 'border-[var(--color-accent-tertiary)] bg-[var(--color-surface)]'
                    : 'bg-[var(--color-bg)] border-[var(--color-border)]'
              }`}
            >
              <span className="text-[var(--color-text-muted)] tabular-nums w-6 text-right font-bold">{i + 1}</span>
              <span className="text-[var(--color-text)] flex-1 truncate font-medium">{n.name}</span>
              <span
                className={`h-2 w-2 rounded-full shrink-0 ${
                  isNodeActive
                    ? 'bg-[var(--color-accent-primary)] animate-pulse'
                    : isNodePassed || isDone
                      ? 'bg-[var(--color-accent-tertiary)]'
                      : 'bg-[var(--color-text-faint)]/40'
                }`}
                aria-hidden
              />
              {typeof n.latencyMs === 'number' && (
                <span className="text-[var(--color-text-muted)] text-xs shrink-0">{n.latencyMs}ms</span>
              )}
            </li>
          );
        })}
      </ol>

      {/* JSON Inspector */}
      {selectedNode && (
        <Modal
          isOpen={!!selectedNode}
          onClose={() => setSelectedNode(null)}
          title={selectedNode.name}
          subtitle={`Step 0${selectedNode.id} · ${selectedNode.latencyMs}ms ${dict.simulator.latency_label}`}
          closeLabel={dict.common.close}
          maxWidth="max-w-xl"
        >
          <div className="p-4 rounded-xl bg-[#090D16] border border-white/10 text-emerald-300 font-mono text-xs overflow-x-auto max-h-72">
            <pre>{JSON.stringify(selectedNode.samplePayload, null, 2)}</pre>
          </div>
          <div className="flex justify-end mt-4">
            <button type="button" onClick={() => setSelectedNode(null)} className="btn btn-primary btn-sm">
              {dict.common.close}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

interface N8nNodeCardProps {
  node: N8nNode;
  index: number;
  isActive: boolean;
  isPassed: boolean;
  isCompletedFinal: boolean;
  isLast: boolean;
  onClick: () => void;
  dict: Dictionary;
}

/** One node card with the 1px connector line to its right neighbour. */
function N8nNodeCard({ node, index, isActive, isPassed, isCompletedFinal, isLast, onClick, dict }: N8nNodeCardProps) {
  return (
    <li className="relative">
      <motion.button
        type="button"
        onClick={onClick}
        aria-label={`${node.name} — ${node.description}`}
        initial={false}
        animate={{
          scale: isActive ? 1.04 : 1,
        }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className={`w-full text-start p-4 rounded-xl border bg-[var(--color-bg)] space-y-3 transition-shadow relative group ${
          isActive
            ? 'border-[var(--color-accent-primary)] shadow-[0_0_25px_rgba(6,182,212,0.3)]'
            : isPassed || isCompletedFinal
              ? 'border-[var(--color-accent-tertiary)]'
              : 'border-[var(--color-border)] hover:border-[var(--color-accent-primary)]'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase text-[var(--color-text-muted)]">
            Step 0{index + 1} · {node.latencyMs}ms
          </span>
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isActive
                ? 'bg-[var(--color-accent-primary)] animate-pulse'
                : isPassed || isCompletedFinal
                  ? 'bg-[var(--color-accent-tertiary)]'
                  : 'bg-[var(--color-text-faint)]/40'
            }`}
            aria-hidden
          />
        </div>

        <div>
          <h4 className="font-display font-semibold text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent-primary)] transition-colors">
            {node.name}
          </h4>
          <p className="font-body text-xs text-[var(--color-text-muted)] mt-1 line-clamp-2">
            {node.description}
          </p>
        </div>

        <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[10px] font-mono text-[var(--color-accent-primary)]">
          <span>{dict.simulator.inspect_json}</span>
          <span aria-hidden>→</span>
        </div>
      </motion.button>

      {/* 1px connector line to the next node (§4.5). Hidden on the last card
          and on the smallest breakpoint where the layout collapses. */}
      {!isLast && (
        <div
          aria-hidden
          className="hidden md:block absolute top-1/2 -right-2 w-4 h-px bg-[var(--color-border)]"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--color-accent-primary) 50%, transparent 50%)',
            backgroundSize: '6px 1px',
            backgroundRepeat: 'repeat-x',
            backgroundColor: 'transparent',
          }}
        />
      )}
    </li>
  );
}
