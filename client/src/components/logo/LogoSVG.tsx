/**
 * LogoSVG.tsx
 * Ravebox logo svg.
 */

// Modules.
import * as React from 'react';


/**
 * Logo icon component.
 */
export const LogoSVGIcon: (
  color?: string
) => JSX.Element = (
  color?: string
): JSX.Element => {

  const logoColor: string = color || '#646AF0';

  return (
    <svg viewBox='0 0 24 24'>
      <title>ravebox icon</title>
        <path d="M12.8818856,1.022347 C13.0509075,1.08866872 13.1353301,1.2824941 13.0704487,1.45526809 L9.93512583,9.80425849 L18.3178808,9.80429991 C19.7991743,9.80429991 21,11.0317824 21,12.5459587 L21,21.2583412 C21,22.7725175 19.7991743,24 18.3178808,24 L5.68211921,24 C4.20082567,24 3,22.7725175 3,21.2583412 L3,12.5459587 C3,11.0317824 4.20082567,9.80429991 5.68211921,9.80429991 L9.13072848,9.80425849 L6.54105544,4.37686758 C6.46168967,4.21053136 6.52926482,4.0099223 6.69198878,3.92879471 C6.85471273,3.84766712 7.05096523,3.91674235 7.13033101,4.08307857 L9.5091457,9.06864097 L12.4583661,1.21509589 C12.5232476,1.04232189 12.7128637,0.956025277 12.8818856,1.022347 Z M7,16 C7.14517977,18.2297291 9.33213267,20 12.0086864,20 C14.6092557,20 16.7476281,18.3288144 17,16.1887126 C16.3081647,17.7254576 14.3484253,18.8334752 12.0389054,18.8334752 C9.63590162,18.8334752 7.611568,17.6339423 7,16 Z" id="Shape" fill={`${logoColor}`}></path>
    </svg>
  );
}

/**
 * Logo component.
 */
export const LogoSVG: () => JSX.Element = (): JSX.Element => {
  return (
    <svg viewBox="0 0 214 60">
        <title>ravebox logo</title>
        <g id="Artboard" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Smaller" fill="#646AF0">
                <path d="M26.351695,0.0582965197 C26.8024201,0.231309709 27.0275469,0.736941121 26.8545297,1.18765589 L18.4936689,22.9676308 L40.8476821,22.9677389 C44.7977982,22.9677389 48,26.1698671 48,30.1198923 L48,52.8478466 C48,56.7978718 44.7977982,60 40.8476821,60 L7.15231788,60 C3.20220179,60 0,56.7978718 0,52.8478466 L0,30.1198923 C0,26.1698671 3.20220179,22.9677389 7.15231788,22.9677389 L16.3486093,22.9676308 L9.44281451,8.80921977 C9.23117244,8.3752992 9.41137286,7.85197123 9.8453034,7.64033402 C10.279234,7.42869682 10.802574,7.60889309 11.014216,8.04281366 L17.3577219,21.0486286 L25.2223097,0.561119706 C25.3953268,0.110404939 25.9009699,-0.114716669 26.351695,0.0582965197 Z M11,41 C11.3774674,47.1317549 17.0635449,52 24.0225846,52 C30.7840648,52 36.343833,47.4042397 37,41.5189597 C35.2012282,45.7450085 30.1059058,48.7920569 24.1011541,48.7920569 C17.8533442,48.7920569 12.5900768,45.4933415 11,41 Z" id="Shape"></path>
                <path d="M59.159,53 C59.627,53 59.991,52.87 60.251,52.61 C60.511,52.35 60.641,51.986 60.641,51.518 L60.641,51.518 L60.641,39.857 L60.6479063,39.5550208 C60.6939479,38.5601597 60.9701979,37.6826597 61.4766563,36.9225208 L61.6355,36.698 C62.2985,35.814 63.1955,35.1575 64.3265,34.7285 C65.4575,34.2995 66.751,34.15 68.207,34.28 C68.649,34.306 69.0455,34.332 69.3965,34.358 C69.7475,34.384 70.0465,34.332 70.2935,34.202 C70.5405,34.072 70.716,33.812 70.82,33.422 C70.976,32.772 70.729,32.278 70.079,31.94 C69.429,31.602 68.506,31.433 67.31,31.433 C65.802,31.433 64.4305,31.797 63.1955,32.525 C62.26925,33.071 61.474625,33.7705625 60.811625,34.6236875 L60.641,34.852 L60.641,33.149 C60.641,32.7395 60.5414688,32.409625 60.3424063,32.159375 L60.251,32.057 C59.991,31.797 59.627,31.667 59.159,31.667 C58.691,31.667 58.327,31.797 58.067,32.057 C57.807,32.317 57.677,32.681 57.677,33.149 L57.677,33.149 L57.677,51.518 C57.677,51.986 57.807,52.35 58.067,52.61 C58.327,52.87 58.691,53 59.159,53 Z M83.378,53.195 C85.276,53.195 86.9725,52.7595 88.4675,51.8885 C89.6421429,51.2041429 90.6241735,50.3271735 91.4135918,49.2575918 L91.49,49.15 L91.49,51.518 C91.49,51.90475 91.5994844,52.2268047 91.8184531,52.4841641 L91.919,52.5905 C92.205,52.8635 92.569,53 93.011,53 C93.453,53 93.817,52.8635 94.103,52.5905 C94.389,52.3175 94.532,51.96 94.532,51.518 L94.532,51.518 L94.532,42.353 C94.506,40.273 94.0185,38.414 93.0695,36.776 C92.1205,35.138 90.8335,33.8445 89.2085,32.8955 C87.5835,31.9465 85.744,31.472 83.69,31.472 C81.636,31.472 79.79,31.9465 78.152,32.8955 C76.514,33.8445 75.2205,35.138 74.2715,36.776 C73.3225,38.414 72.848,40.273 72.848,42.353 C72.848,44.407 73.3095,46.253 74.2325,47.891 C75.1555,49.529 76.41,50.8225 77.996,51.7715 C79.582,52.7205 81.376,53.195 83.378,53.195 Z M83.69,50.465 C82.208,50.465 80.869,50.114 79.673,49.412 C78.477,48.71 77.528,47.7415 76.826,46.5065 C76.124,45.2715 75.773,43.887 75.773,42.353 C75.773,40.793 76.124,39.402 76.826,38.18 C77.528,36.958 78.477,35.9895 79.673,35.2745 C80.869,34.5595 82.208,34.202 83.69,34.202 C85.198,34.202 86.5435,34.5595 87.7265,35.2745 C88.9095,35.9895 89.8455,36.958 90.5345,38.18 C91.2235,39.402 91.568,40.793 91.568,42.353 C91.568,43.887 91.2235,45.2715 90.5345,46.5065 C89.8455,47.7415 88.9095,48.71 87.7265,49.412 C86.5435,50.114 85.198,50.465 83.69,50.465 Z M106.505,53 C107.181,53 107.675,52.662 107.987,51.986 L107.987,51.986 L116.528,33.578 C116.684,33.266 116.697,32.9345 116.567,32.5835 C116.437,32.2325 116.19,31.966 115.826,31.784 C115.462,31.628 115.0915,31.6085 114.7145,31.7255 C114.3375,31.8425 114.071,32.083 113.915,32.447 L113.915,32.447 L106.519,48.683 L99.017,32.447 C98.861,32.1572857 98.6476939,31.9439796 98.3770816,31.8070816 L98.237,31.745 C97.899,31.615 97.548,31.641 97.184,31.823 C96.794,32.005 96.534,32.265 96.404,32.603 C96.274,32.941 96.287,33.279 96.443,33.617 L96.443,33.617 L105.101,51.986 C105.413,52.662 105.881,53 106.505,53 Z M129.671,53.195 C130.893,53.195 132.167,52.9545 133.493,52.4735 C134.819,51.9925 135.911,51.388 136.769,50.66 C137.081,50.4 137.2305,50.088 137.2175,49.724 C137.2045,49.36 137.029,49.022 136.691,48.71 C136.431,48.502 136.119,48.4045 135.755,48.4175 C135.391,48.4305 135.066,48.554 134.78,48.788 C134.208,49.282 133.4475,49.6915 132.4985,50.0165 C131.5495,50.3415 130.607,50.504 129.671,50.504 C128.111,50.504 126.733,50.153 125.537,49.451 C124.341,48.749 123.3985,47.787 122.7095,46.565 C122.1795,45.625 121.853346,44.5773077 121.731038,43.4219231 L121.723,43.328 L137.471,43.328 C137.827571,43.328 138.126837,43.2372653 138.368796,43.0557959 L138.485,42.9575 C138.745,42.7105 138.875,42.379 138.875,41.963 C138.875,39.935 138.472,38.128 137.666,36.542 C136.86,34.956 135.7225,33.7145 134.2535,32.8175 C132.7845,31.9205 131.062,31.472 129.086,31.472 C127.084,31.472 125.316,31.94 123.782,32.876 C122.248,33.812 121.0455,35.0925 120.1745,36.7175 C119.3035,38.3425 118.868,40.221 118.868,42.353 C118.868,44.459 119.3295,46.331 120.2525,47.969 C121.1755,49.607 122.4495,50.8875 124.0745,51.8105 C125.6995,52.7335 127.565,53.195 129.671,53.195 Z M136.058,40.832 L121.776,40.832 C121.896028,39.97075 122.119399,39.1713854 122.446115,38.4339062 L122.5925,38.1215 C123.2035,36.8865 124.068,35.918 125.186,35.216 C126.304,34.514 127.604,34.163 129.086,34.163 C130.542,34.163 131.7965,34.501 132.8495,35.177 C133.9025,35.853 134.715,36.789 135.287,37.985 C135.668333,38.7823333 135.916778,39.649 136.032333,40.585 L136.058,40.832 Z M154.748,53.195 C156.828,53.195 158.687,52.7205 160.325,51.7715 C161.963,50.8225 163.2565,49.529 164.2055,47.891 C165.1545,46.253 165.629,44.394 165.629,42.314 C165.629,40.26 165.1675,38.414 164.2445,36.776 C163.3215,35.138 162.067,33.8445 160.481,32.8955 C158.895,31.9465 157.101,31.472 155.099,31.472 C153.357,31.472 151.7775,31.8425 150.3605,32.5835 C148.9435,33.3245 147.806,34.306 146.948,35.528 L146.948,35.528 L146.948,24.062 C146.948,23.594 146.8115,23.2235 146.5385,22.9505 C146.2655,22.6775 145.908,22.541 145.466,22.541 C144.998,22.541 144.6275,22.6775 144.3545,22.9505 C144.0815,23.2235 143.945,23.594 143.945,24.062 L143.945,24.062 L143.945,42.47 C143.971,44.498 144.4585,46.3245 145.4075,47.9495 C146.3565,49.5745 147.6435,50.855 149.2685,51.791 C150.8935,52.727 152.72,53.195 154.748,53.195 Z M154.748,50.465 C153.266,50.465 151.927,50.1075 150.731,49.3925 C149.535,48.6775 148.599,47.709 147.923,46.487 C147.247,45.265 146.909,43.874 146.909,42.314 C146.909,40.78 147.247,39.3955 147.923,38.1605 C148.599,36.9255 149.535,35.957 150.731,35.255 C151.927,34.553 153.266,34.202 154.748,34.202 C156.256,34.202 157.608,34.553 158.804,35.255 C160,35.957 160.9425,36.9255 161.6315,38.1605 C162.3205,39.3955 162.665,40.78 162.665,42.314 C162.665,43.874 162.3205,45.265 161.6315,46.487 C160.9425,47.709 160,48.6775 158.804,49.3925 C157.608,50.1075 156.256,50.465 154.748,50.465 Z M181.229,53.195 C183.309,53.195 185.1615,52.727 186.7865,51.791 C188.4115,50.855 189.6985,49.568 190.6475,47.93 C191.5965,46.292 192.071,44.433 192.071,42.353 C192.045,40.247 191.564,38.375 190.628,36.737 C189.692,35.099 188.4115,33.812 186.7865,32.876 C185.1615,31.94 183.309,31.472 181.229,31.472 C179.149,31.472 177.29,31.94 175.652,32.876 C174.014,33.812 172.727,35.099 171.791,36.737 C170.855,38.375 170.387,40.247 170.387,42.353 C170.387,44.433 170.855,46.292 171.791,47.93 C172.727,49.568 174.014,50.855 175.652,51.791 C177.29,52.727 179.149,53.195 181.229,53.195 Z M181.229,50.465 C179.721,50.465 178.369,50.114 177.173,49.412 C175.977,48.71 175.0345,47.748 174.3455,46.526 C173.6565,45.304 173.312,43.913 173.312,42.353 C173.312,40.793 173.6565,39.3955 174.3455,38.1605 C175.0345,36.9255 175.977,35.957 177.173,35.255 C178.369,34.553 179.721,34.202 181.229,34.202 C182.737,34.202 184.089,34.553 185.285,35.255 C186.481,35.957 187.417,36.9255 188.093,38.1605 C188.769,39.3955 189.107,40.793 189.107,42.353 C189.107,43.913 188.769,45.304 188.093,46.526 C187.417,47.748 186.481,48.71 185.285,49.412 C184.089,50.114 182.737,50.465 181.229,50.465 Z M210.869,53 C211.155,53 211.4345,52.896 211.7075,52.688 C211.9805,52.48 212.143,52.194 212.195,51.83 C212.247,51.466 212.104,51.076 211.766,50.66 L211.766,50.66 L205.12,42.156 L211.61,34.124 C211.832857,33.8342857 211.96498,33.5302449 212.006367,33.2118776 L212.0195,33.0515 C212.0325,32.6745 211.922,32.3495 211.688,32.0765 C211.454,31.8035 211.116,31.667 210.674,31.667 C210.44,31.667 210.2125,31.719 209.9915,31.823 C209.7705,31.927 209.569,32.109 209.387,32.369 L209.387,32.369 L203.205,40.195 L196.907,32.135 C196.634,31.862 196.311234,31.7084375 195.938703,31.6743125 L195.776,31.667 C195.334,31.667 194.996,31.8035 194.762,32.0765 C194.528,32.3495 194.4045,32.668 194.3915,33.032 C194.3785,33.396 194.515,33.747 194.801,34.085 L194.801,34.085 L201.189,42.198 L194.45,50.621 C194.204857,50.9107143 194.069551,51.2099796 194.044082,51.5187959 L194.0405,51.674 C194.0535,52.038 194.1835,52.35 194.4305,52.61 C194.6775,52.87 195.009,53 195.425,53 C195.893,53 196.244,52.844 196.478,52.532 L196.478,52.532 L203.091,44.143 L209.504,52.298 C209.6704,52.506 209.83264,52.66408 209.99072,52.77224 L210.1085,52.844 C210.3035,52.948 210.557,53 210.869,53 Z" id="ravebox" fillRule="nonzero"></path>
            </g>
        </g>
    </svg>
  );
}
