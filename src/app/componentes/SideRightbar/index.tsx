function SideRightbar() {
    const colors = [
        '#ef4444', // red-500
        '#ec4899', // pink-500  
        '#a855f7', // purple-500
        '#3b82f6', // blue-500
        '#06b6d4', // cyan-500
        '#10b981', // emerald-500
        '#84cc16', // lime-500
        '#22c55e', // green-500
    ];

    const savedPalettes = [
        {
            title: "Ocean Vibes",
            colors: ["#ef4444", "#ec4899", "#a855f7"],
        },
        {
            title: "Sunset Glow",
            colors: ["#3b82f6", "#06b6d4", "#10b981"],
        },
        {
            title: "Tree Forest",
            colors: ["#84cc16", "#22c55e", "#f97316"],
        },
    ];

    return (
   <aside className="px-10 w-75 border border-gray-800 rounded-xl">
  <div>
    <h2 className="mb-1 text-gray-400 font-semibold py-2">CORES RECENTES</h2>
    <ul className="grid grid-cols-4 gap-2 mb-4">
      {colors.map((color, index) => (
        <li
          key={index}
          className="w-12 h-12 rounded-lg cursor-pointer hover:scale-110 transition-transform duration-200"
          style={{ backgroundColor: color }}
        />
      ))}
    </ul>
  </div>

  <div>
    <h2 className="mb-1 text-gray-400 font-semibold py-2">PALETAS SALVAS</h2>
    <ul className="space-y-3">
      {savedPalettes.map((palette, index) => (
        <li key={index}>
          <div className="flex flex-col p-3 rounded-lg bg-[#191c1f] hover:bg-slate-800 transition-colors cursor-pointer">
            <h2 className="mb-2 font-medium">{palette.title}</h2>
            <div className="flex gap-1">
              {palette.colors.map((color) => (
                <span
                  key={color}
                  className="w-5 h-5 rounded-md"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
</aside>

    );
}

export default SideRightbar;
