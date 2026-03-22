import styles from "./TimeRangeTabs.module.css";

const TABS = [
  { key: "short", label: "4 Weeks" },
  { key: "medium", label: "6 Months" },
  { key: "long", label: "All Time" },
];

export default function TimeRangeTabs({ active, onChange }) {
  return (
    <div className={styles.tabs} role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={active === tab.key}
          className={`${styles.tab} ${active === tab.key ? styles.active : ""}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
