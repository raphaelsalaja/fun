interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  width?: number | string;
  height?: number | string;
  color?: string | "currentColor";
}

export function Logo(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      {...props}
    >
      <title>Fun Logo</title>
      <mask
        id="mask0_3002_369"
        maskUnits="userSpaceOnUse"
        x="5"
        y="2"
        width="14"
        height="20"
      >
        <path d="M5.112 2.808H18.888V21.1759H5.112V2.808Z" fill="white" />
      </mask>
      <g mask="url(#mask0_3002_369)">
        <path
          d="M11.0376 4.08238L18.132 7.85998V16.1256L11.0376 19.9008V4.08238Z"
          fill="currentColor"
        />
        <path
          d="M10.272 2.80798V21.1752L18.8976 16.584V7.39918L10.272 2.80798ZM11.8032 5.35678L17.3664 8.31838V15.6648L11.8032 18.6264V5.35678Z"
          fill="currentColor"
        />
        <path
          d="M7.68961 2.80798V21.1752L8.97841 20.4888V3.49438L7.68961 2.80798Z"
          fill="currentColor"
        />
        <path
          d="M5.112 2.808V21.1752L6.4008 20.4888V3.4944L5.112 2.808Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

export function SwapArrow(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <title>Swap Arrow</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 3C17.5523 3 18 3.44772 18 4V18.0858L20.2929 15.7929C20.6834 15.4024 21.3166 15.4024 21.7071 15.7929C22.0976 16.1834 22.0976 16.8166 21.7071 17.2071L18.7678 20.1464C17.7915 21.1228 16.2085 21.1228 15.2322 20.1464L12.2929 17.2071C11.9024 16.8166 11.9024 16.1834 12.2929 15.7929C12.6834 15.4024 13.3166 15.4024 13.7071 15.7929L16 18.0858V4C16 3.44772 16.4477 3 17 3ZM8 5.91421L10.2929 8.20711C10.6834 8.59763 11.3166 8.59763 11.7071 8.20711C12.0976 7.81658 12.0976 7.18342 11.7071 6.79289L8.76777 3.85355"
        fill="currentColor"
      />
      <path
        d="M8.76777 3.85355C7.79145 2.87724 6.20854 2.87724 5.23223 3.85355L2.29289 6.79289C1.90237 7.18342 1.90237 7.81658 2.29289 8.20711C2.68342 8.59763 3.31658 8.59763 3.70711 8.20711L6 5.91421V20C6 20.5523 6.44772 21 7 21C7.55228 21 8 20.5523 8 20V5.91421L10.2929 8.20711C10.6834 8.59763 11.3166 8.59763 11.7071 8.20711C12.0976 7.81658 12.0976 7.18342 11.7071 6.79289L8.76777 3.85355Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Search(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <title>Search Icon</title>
      <path
        d="M19.249 12.5V5.74512C19.249 4.08826 17.9059 2.74512 16.249 2.74512H6.75394C5.09709 2.74512 3.75395 4.08826 3.75394 5.74511L3.75391 18.2461C3.7539 19.9029 5.09705 21.2461 6.75391 21.2461H11.999M7.74905 14.75H9.24905M7.74905 6.75H15.249M7.74905 10.75H11.249M19.3704 20.364C18.1988 21.5355 16.2993 21.5355 15.1277 20.364C13.9562 19.1924 13.9562 17.2929 15.1277 16.1213C16.2993 14.9497 18.1988 14.9497 19.3704 16.1213C20.5419 17.2929 20.5419 19.1924 19.3704 20.364ZM19.3704 20.364L21.249 22.2426"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />{" "}
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <title>Check Icon</title>
      <path
        d="M7.75 13.0625L10.9375 16.25L16.25 7.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
