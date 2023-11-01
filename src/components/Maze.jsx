function Maze ({ mazeData }) {
  return (
    <div className="maze">
      {mazeData.map((row, rowIndex) => (
        <section key={rowIndex} className="maze-row">
          {row.map((cell, colIndex) => (
            <article
              key={colIndex}
              className={`maze-cell ${cell === 0 ? '' : cell === 1 ? 'wall' : cell === 2 ? 'start' : cell === 3 ? 'exit' : cell === 4 ? 'player' : ''}`}
            ></article>
          ))}
        </section>
      ))}
    </div>
  );
}

export default Maze
