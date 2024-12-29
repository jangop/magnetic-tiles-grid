import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				connetix: {
					red: {
						light: '#FF6B6B',
						DEFAULT: '#FF0000',
						dark: '#CC0000'
					},
					blue: {
						light: '#4DA9FF',
						DEFAULT: '#0066CC',
						dark: '#004C99'
					},
					yellow: {
						light: '#FFE066',
						DEFAULT: '#FFD700',
						dark: '#CCB100'
					},
					green: {
						light: '#66CC66',
						DEFAULT: '#339933',
						dark: '#267326'
					},
					purple: {
						light: '#B366FF',
						DEFAULT: '#8000FF',
						dark: '#6600CC'
					},
					orange: {
						light: '#FFB366',
						DEFAULT: '#FF8000',
						dark: '#CC6600'
					}
				}
			}
		}
	},
	plugins: [daisyui],
	daisyui: {
		themes: ['light', 'dark']
	}
} satisfies Config;
