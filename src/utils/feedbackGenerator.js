/**
 * Generates realistic, contextual customer reviews based on day's outcome
 */
export function generateCustomerFeedback({
  chaiPrice,
  lostCustomers,
  bottleneck,
  isDiluted = false,
  cupsSold = 0,
}) {
  const reviews = [];

  // 1. Dilution reviews take priority if water was added
  if (isDiluted) {
    reviews.push(
      {
        id: 1,
        author: 'Sharma Ji (Retired Bank Manager)',
        rating: 1,
        badge: 'Regular Customer',
        comment: 'Tasted like warm brown water today! Where is the malai? Did you boil tap water in the kettle?',
        avatar: '👴',
      },
      {
        id: 2,
        author: 'Neha (Marketing Executive)',
        rating: 2,
        badge: 'Office Patron',
        comment: 'Chai was unusually thin and watery. Hope this was just a one-off mistake and not cost-cutting.',
        avatar: '👩',
      }
    );
  }

  // 2. Stockout reviews if customers were turned away
  if (lostCustomers > 8) {
    reviews.push({
      id: 3,
      author: 'Vikram (Software Engineer)',
      rating: 2,
      badge: 'Evening Commuter',
      comment: `Came with 4 colleagues right at 6 PM rush hour, and you were completely out of ${bottleneck || 'chai'}! Very frustrating.`,
      avatar: '👨‍💻',
    });
  } else if (lostCustomers > 0) {
    reviews.push({
      id: 4,
      author: 'Priya (College Student)',
      rating: 3,
      badge: 'Student',
      comment: 'Queued up for 10 minutes only to hear "khatam ho gaya". Please stock more cups next time!',
      avatar: '🎓',
    });
  }

  // 3. Price-based customer sentiment
  if (chaiPrice <= 10) {
    reviews.push({
      id: 5,
      author: 'Ramesh (Delivery Partner)',
      rating: 5,
      badge: 'Daily Commuter',
      comment: `At ₹${chaiPrice}, this is the best cutting chai in the entire district! Piping hot and full paisa-vasool.`,
      avatar: '🛵',
    });
    reviews.push({
      id: 6,
      author: 'Ananya (Intern)',
      rating: 5,
      badge: 'Loyal Customer',
      comment: `Unbeatable price! My whole team comes here every afternoon for our chai break.`,
      avatar: '👩‍💼',
    });
  } else if (chaiPrice <= 18) {
    reviews.push({
      id: 7,
      author: 'Aditya (Consultant)',
      rating: 5,
      badge: 'Tea Enthusiast',
      comment: `Perfect balance of Assam tea and cardamom sweetness. Fair ₹${chaiPrice} price for authentic tapri taste!`,
      avatar: '🧔',
    });
    reviews.push({
      id: 8,
      author: 'Kavita (Lawyer)',
      rating: 4,
      badge: 'Local Resident',
      comment: `Strong kadak boil with rich milk. Consistent quality day after day.`,
      avatar: '👩‍⚖️',
    });
  } else if (chaiPrice <= 26) {
    reviews.push({
      id: 9,
      author: 'Siddharth (Architect)',
      rating: 3,
      badge: 'Occasional Visitor',
      comment: `Good ginger flavor, but ₹${chaiPrice} is steep for a roadside tea stall. Might look for alternatives.`,
      avatar: '👓',
    });
  } else {
    reviews.push({
      id: 10,
      author: 'Manish (Auto Driver)',
      rating: 1,
      badge: 'Passerby',
      comment: `₹${chaiPrice} for a cup of tea?! Are you serving melted gold? I can get two samosas and chai for that!`,
      avatar: '🛺',
    });
    reviews.push({
      id: 11,
      author: 'Meera (Graphic Designer)',
      rating: 2,
      badge: 'Office Worker',
      comment: `Air-conditioned cafe pricing at a street corner without seating. Not coming back at this rate.`,
      avatar: '🎨',
    });
  }

  // Add a generic positive review if cups were sold and review count is low
  if (cupsSold > 15 && reviews.length < 3) {
    reviews.push({
      id: 12,
      author: 'Deepak (Accountant)',
      rating: 5,
      badge: 'Morning Regular',
      comment: 'Kadak, refreshing, and served with a smile. The perfect fuel to start a busy work day!',
      avatar: '💼',
    });
  }

  // Return a slice of 3 diverse reviews
  return reviews.slice(0, 3);
}
