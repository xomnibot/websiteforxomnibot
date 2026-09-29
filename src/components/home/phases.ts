/** The six phases of the home-page "kill chain". Shared by the sections and the progress rail. */
export const phases = [
  { id: 'recon', num: '00', name: 'RECON' },
  { id: 'enumerate', num: '01', name: 'ENUMERATE' },
  { id: 'exploit', num: '02', name: 'EXPLOIT' },
  { id: 'escalate', num: '03', name: 'ESCALATE' },
  { id: 'persist', num: '04', name: 'PERSIST' },
  { id: 'exfil', num: '05', name: 'EXFIL' },
] as const;

export const phaseLabel = (id: (typeof phases)[number]['id']) => {
  const p = phases.find((x) => x.id === id)!;
  return `${p.num} // ${p.name}`;
};
