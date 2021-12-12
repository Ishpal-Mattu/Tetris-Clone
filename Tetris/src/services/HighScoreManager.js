/**
 * This class is responsible for reading and writing the high scores
 * of our game to and from the browser's local storage.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 */
 export default class HighScoreManager {
    static MAX_HIGH_SCORES = 5;

	static loadHighScores() {
		/**
		 * Since the high scores are being saved as a string containing JSON,
		 * we must parse the string into a valid JavaScript object in order
		 * to manipulate it.
		 */
		const highScores = JSON.parse(localStorage.getItem('highScores')) ?? [];

		if (highScores.length === 0) {
			// If there are no scores, we want to populate the scores array with placeholders.
			for (let i = HighScoreManager.MAX_HIGH_SCORES; i > 0; i--) {
				highScores.push({ name: 'AAA', score: i * 1000 });
			}

			// Json stringify the javascript object and store it in the local storage.
			localStorage.setItem('highScores', JSON.stringify(highScores));
		}

		return highScores;
	}

	static addHighScore(name, score) {
		let highScores = HighScoreManager.loadHighScores();

		// Add the new score to the high scores array.
		highScores.push({ name: name, score: score });

		
		// Sort the scores from highest to lowest.
		highScores = highScores.sort((a, b) => b.score - a.score);

		// Only keep the top 5 scores
		highScores = highScores.slice(0, HighScoreManager.MAX_HIGH_SCORES);

		// Json stringify the javascript object and store it in the local storage.
		localStorage.setItem('highScores', JSON.stringify(highScores));
	}
}
