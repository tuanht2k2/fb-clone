function GameIcon({ height, width, className }) {
  return (
    <svg viewBox="0 0 28 28" className={className} fill="currentColor" height={height} width={width}>
      <g fillRule="evenodd" transform="translate(-444 -204)">
        <g>
          <path
            fillRule="nonzero"
            d="M98.5 5.75v4a.75.75 0 1 0 1.5 0v-4a.75.75 0 1 0-1.5 0z"
            transform="translate(351.5 208.5)"
          ></path>
          <path
            fillRule="nonzero"
            d="M97.25 8.5h4a.75.75 0 1 0 0-1.5h-4a.75.75 0 1 0 0 1.5z"
            transform="translate(351.5 208.5)"
          ></path>
          <path
            fillRule="nonzero"
            d="M109.5 14.5h-10a7 7 0 0 1 0-14h10a7 7 0 0 1 0 14zm0-1.5a5.5 5.5 0 0 0 0-11h-10a5.5 5.5 0 0 0 0 11h10z"
            transform="translate(351.5 208.5)"
          ></path>
          <path
            d="M109 9.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0m3-3a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0"
            transform="translate(351.5 208.5)"
          ></path>
        </g>
      </g>
    </svg>
  );
}

export default GameIcon;
