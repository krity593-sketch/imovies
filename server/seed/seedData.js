import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Theater from '../models/Theater.js';
import Show from '../models/Show.js';
import Booking from '../models/Booking.js';
import { generateSeatLayout } from '../controllers/showController.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies';

const movies = [
  {
    title: 'Jawan',
    description: 'A high-octane action thriller outlining the emotional journey of a man who is set to rectify the wrongs in the society, driven by a personal vendetta while keeping a promise made years ago.',
    genre: ['Action', 'Thriller', 'Drama'],
    language: ['Hindi', 'Tamil', 'Telugu'],
    duration: 169,
    releaseDate: new Date('2023-09-07'),
    rating: 8.5,
    votesCount: 94200,
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=MWOlnZSnXJo',
    status: 'NOW_SHOWING',
    director: 'Atlee',
    cast: ['Shah Rukh Khan', 'Nayanthara', 'Vijay Sethupathi', 'Deepika Padukone'],
    certification: 'UA'
  },
  {
    title: 'Stree 2: Sarkate Ka Aatank',
    description: 'The town of Chanderi is being haunted once again, this time by a headless entity known as Sarkata that abducts modern independent women. Vicky and his loyal friends team up with the mysterious maiden to protect their town.',
    genre: ['Comedy', 'Horror', 'Mystery'],
    language: ['Hindi'],
    duration: 147,
    releaseDate: new Date('2024-08-15'),
    rating: 8.3,
    votesCount: 68300,
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=KVnhefZ-7eU',
    status: 'NOW_SHOWING',
    director: 'Amar Kaushik',
    cast: ['Shraddha Kapoor', 'Rajkummar Rao', 'Pankaj Tripathi', 'Abhishek Banerjee'],
    certification: 'UA'
  },
  {
    title: 'Kalki 2898 AD',
    description: 'Set in a post-apocalyptic dystopian city of Kasi in the year 2898 AD, ruled by totalitarian god-king Supreme Yaskin. Ashwatthama awakens to protect SUM-80, who carries the miraculous tenth avatar of Lord Vishnu.',
    genre: ['Sci-Fi', 'Action', 'Mythology'],
    language: ['Hindi', 'Telugu', 'Tamil'],
    duration: 181,
    releaseDate: new Date('2024-06-27'),
    rating: 8.7,
    votesCount: 112000,
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=kQDd1AhGIHk',
    status: 'NOW_SHOWING',
    director: 'Nag Ashwin',
    cast: ['Prabhas', 'Amitabh Bachchan', 'Deepika Padukone', 'Kamal Haasan'],
    certification: 'UA'
  },
  {
    title: 'Animal',
    description: 'A complex psychological journey exploring the turbulent relationship between a fiercely devoted son and his emotionally distant industrialist father, which descends into violent underworld retribution.',
    genre: ['Action', 'Crime', 'Drama'],
    language: ['Hindi', 'Telugu'],
    duration: 201,
    releaseDate: new Date('2023-12-01'),
    rating: 8.1,
    votesCount: 78500,
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=Dydmpfo68DA',
    status: 'NOW_SHOWING',
    director: 'Sandeep Reddy Vanga',
    cast: ['Ranbir Kapoor', 'Anil Kapoor', 'Rashmika Mandanna', 'Bobby Deol'],
    certification: 'A'
  },
  {
    title: 'Bhool Bhulaiyaa 3',
    description: 'Rooh Baba enters a sinister royal castle in Bengal to confront not just one, but two vengeful spirits of Manjulika, unleashing a hilarious yet spine-chilling mystery battle.',
    genre: ['Comedy', 'Horror'],
    language: ['Hindi'],
    duration: 158,
    releaseDate: new Date('2024-11-01'),
    rating: 8.0,
    votesCount: 45000,
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=7WGYtT-xP4g',
    status: 'NOW_SHOWING',
    director: 'Anees Bazmee',
    cast: ['Kartik Aaryan', 'Vidya Balan', 'Madhuri Dixit', 'Triptii Dimri'],
    certification: 'UA'
  },
  {
    title: '12th Fail',
    description: 'Based on the true story of IPS officer Manoj Kumar Sharma who restarts his academic journey despite extreme poverty and clears the world’s toughest competitive exam, the UPSC.',
    genre: ['Biography', 'Drama'],
    language: ['Hindi'],
    duration: 147,
    releaseDate: new Date('2023-10-27'),
    rating: 9.1,
    votesCount: 135000,
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=we5b3U_u9sU',
    status: 'NOW_SHOWING',
    director: 'Vidhu Vinod Chopra',
    cast: ['Vikrant Massey', 'Medha Shankr', 'Anant V Joshi'],
    certification: 'U'
  },
  {
    title: 'Fighter',
    description: 'Top Indian Air Force aviators form an elite specialized combat team called Air Dragons to counter ruthless airborne terror strikes in Srinagar and the Kashmir valley.',
    genre: ['Action', 'Thriller'],
    language: ['Hindi'],
    duration: 166,
    releaseDate: new Date('2024-01-25'),
    rating: 8.2,
    votesCount: 52000,
    posterUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=6amIq_mP4xM',
    status: 'NOW_SHOWING',
    director: 'Siddharth Anand',
    cast: ['Hrithik Roshan', 'Deepika Padukone', 'Anil Kapoor'],
    certification: 'UA'
  },
  {
    title: 'RRR',
    description: 'A fictional story about two legendary Indian revolutionaries, Alluri Sitarama Raju and Komaram Bheem, and their epic fight against the tyrannical British Raj in the 1920s.',
    genre: ['Action', 'Historical', 'Drama'],
    language: ['Hindi', 'Telugu', 'Tamil'],
    duration: 187,
    releaseDate: new Date('2022-03-25'),
    rating: 8.8,
    votesCount: 165000,
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=NgBoMJy386M',
    status: 'NOW_SHOWING',
    director: 'S.S. Rajamouli',
    cast: ['N.T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt', 'Ajay Devgn'],
    certification: 'UA'
  },
  {
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, fulfilling his destiny across the sands of Arrakis.',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    language: ['Hindi', 'English'],
    duration: 166,
    releaseDate: new Date('2024-03-01'),
    rating: 8.7,
    votesCount: 42100,
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    status: 'NOW_SHOWING',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    certification: 'UA'
  },
  {
    title: 'Singham Again',
    description: 'DCP Bajirao Singham returns to battle an international crime syndicate threatening Indian sovereignty, marshaling the entire Cop Universe heroes in an explosive showdown.',
    genre: ['Action', 'Crime'],
    language: ['Hindi'],
    duration: 155,
    releaseDate: new Date('2026-11-01'),
    rating: 8.4,
    votesCount: 38000,
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=r0fN_k9c3Z4',
    status: 'COMING_SOON',
    director: 'Rohit Shetty',
    cast: ['Ajay Devgn', 'Kareena Kapoor', 'Ranveer Singh', 'Akshay Kumar', 'Deepika Padukone'],
    certification: 'UA'
  }
];

const theaters = [
  {
    name: 'PVR INOX: Phoenix Palladium',
    city: 'Mumbai',
    address: 'High Street Phoenix, 462 Senapati Bapat Marg, Lower Parel, Mumbai',
    facilities: ['IMAX Laser', 'Dolby Atmos', 'Gold Class Recliner', 'Gourmet Food', 'Valet Parking'],
    phone: '+91 22 6678 4000',
    screens: [
      { screenNumber: 1, screenName: 'IMAX Laser 1', totalSeats: 64 },
      { screenNumber: 2, screenName: 'Gold Class 2', totalSeats: 64 }
    ]
  },
  {
    name: 'PVR ICON: Infiniti Mall',
    city: 'Mumbai',
    address: 'Link Road, Oshiwara, Andheri West, Mumbai, Maharashtra',
    facilities: ['4K Dolby Atmos', '4DX Motion', 'VIP Lounge', 'Cafe Bistro'],
    phone: '+91 22 4000 8000',
    screens: [
      { screenNumber: 1, screenName: 'Screen 1', totalSeats: 64 },
      { screenNumber: 2, screenName: 'Screen 2', totalSeats: 64 }
    ]
  },
  {
    name: "PVR Director's Cut: Ambience Mall",
    city: 'Delhi NCR',
    address: 'Nelson Mandela Marg, Vasant Kunj, New Delhi, Delhi',
    facilities: ['Ultra Luxe Recliners', 'Dedicated Butler Service', 'Chef Crafted Dining', 'Dolby 7.1'],
    phone: '+91 11 4087 0000',
    screens: [
      { screenNumber: 1, screenName: 'Auditorium 1', totalSeats: 64 },
      { screenNumber: 2, screenName: 'Auditorium 2', totalSeats: 64 }
    ]
  },
  {
    name: 'INOX Megamall',
    city: 'Delhi NCR',
    address: 'Golf Course Road, DLF Phase 1, Sector 28, Gurugram, Haryana',
    facilities: ['Insignia Recliners', 'Dolby Atmos', 'Laser 4K', 'Snack Bar'],
    phone: '+91 124 456 7890',
    screens: [
      { screenNumber: 1, screenName: 'Insignia 1', totalSeats: 64 },
      { screenNumber: 2, screenName: 'Classic 2', totalSeats: 64 }
    ]
  },
  {
    name: 'PVR P[XL] & IMAX: The Forum Mall',
    city: 'Bengaluru',
    address: 'Hosur Road, Chikku Lakshmaiah Layout, Koramangala, Bengaluru, Karnataka',
    facilities: ['IMAX 3D', 'P[XL] Gigantic Screen', 'Dolby Atmos', 'Recliners'],
    phone: '+91 80 4123 9000',
    screens: [
      { screenNumber: 1, screenName: 'IMAX Theater 1', totalSeats: 64 },
      { screenNumber: 2, screenName: 'P[XL] Screen 2', totalSeats: 64 }
    ]
  },
  {
    name: 'Cinepolis Forum Shantiniketan',
    city: 'Bengaluru',
    address: 'Whitefield Main Road, Hoodi, Bengaluru, Karnataka',
    facilities: ['VIP Recliner', 'RealD 3D', 'Dolby 7.1', 'Coffee House'],
    phone: '+91 80 6754 3210',
    screens: [
      { screenNumber: 1, screenName: 'Audi 1', totalSeats: 64 },
      { screenNumber: 2, screenName: 'Audi 2', totalSeats: 64 }
    ]
  },
  {
    name: 'Prasads Multiplex & Large Screen',
    city: 'Hyderabad',
    address: 'NTR Gardens, Necklace Road, Khairatabad, Hyderabad, Telangana',
    facilities: ['Giant PCX Screen', 'Dolby Atmos', 'Simulated 4D', 'Gaming Zone'],
    phone: '+91 40 2344 8888',
    screens: [
      { screenNumber: 1, screenName: 'Large Screen 1', totalSeats: 64 },
      { screenNumber: 2, screenName: 'Digital Audi 2', totalSeats: 64 }
    ]
  },
  {
    name: 'AMB Cinemas (Mahesh Babu)',
    city: 'Hyderabad',
    address: 'Sarath City Capital Mall, Gachibowli - Miyapur Rd, Hyderabad, Telangana',
    facilities: ['Laser VIP', 'M-Lounge', 'Dolby Atmos', 'World Class Concessions'],
    phone: '+91 40 6815 4444',
    screens: [
      { screenNumber: 1, screenName: 'Audi 1 VIP', totalSeats: 64 },
      { screenNumber: 2, screenName: 'Audi 2 Super', totalSeats: 64 }
    ]
  },
  {
    name: 'Sathyam Cinemas (SPI)',
    city: 'Chennai',
    address: '8 Thiruvika Road, Peters Colony, Royapettah, Chennai, Tamil Nadu',
    facilities: ['RDX 4K Projection', 'Auro 11.1 3D Sound', 'Famous Sathyam Popcorn', 'Balcony Seating'],
    phone: '+91 44 4224 4224',
    screens: [
      { screenNumber: 1, screenName: 'Sathyam Screen', totalSeats: 64 },
      { screenNumber: 2, screenName: 'Santham Screen', totalSeats: 64 }
    ]
  },
  {
    name: 'INOX South City Mall',
    city: 'Kolkata',
    address: '375 Prince Anwar Shah Road, South City Complex, Jadavpur, Kolkata, West Bengal',
    facilities: ['Insignia 7-Star Luxe', 'Dolby Atmos', 'Plush Recliners', 'Gourmet Indian Snacks'],
    phone: '+91 33 4007 2000',
    screens: [
      { screenNumber: 1, screenName: 'Screen 1', totalSeats: 64 },
      { screenNumber: 2, screenName: 'Screen 2', totalSeats: 64 }
    ]
  },
  {
    name: 'PVR Phoenix Marketcity',
    city: 'Pune',
    address: 'Viman Nagar, Nagar Road, Pune, Maharashtra',
    facilities: ['4DX', 'Gold Class', 'Dolby Atmos', 'Multi-Cuisine Cafe'],
    phone: '+91 20 6689 0000',
    screens: [
      { screenNumber: 1, screenName: 'Screen 1', totalSeats: 64 },
      { screenNumber: 2, screenName: 'Screen 2', totalSeats: 64 }
    ]
  },
  {
    name: 'PVR Acropolis Mall',
    city: 'Ahmedabad',
    address: 'Thaltej Cross Road, SG Highway, Ahmedabad, Gujarat',
    facilities: ['Dolby Atmos', 'Gold Class Recliners', 'Live Food Station'],
    phone: '+91 79 4000 7000',
    screens: [
      { screenNumber: 1, screenName: 'Screen 1', totalSeats: 64 },
      { screenNumber: 2, screenName: 'Screen 2', totalSeats: 64 }
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('⚡ Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Theater.deleteMany({});
    await Show.deleteMany({});
    await Booking.deleteMany({});
    console.log('🧹 Purged existing database records.');

    // 1. Create Users (Admin and Standard User)
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@imovies.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    });

    const standardUser = await User.create({
      name: 'Aarav Sharma',
      email: 'john@example.com',
      password: 'user123',
      role: 'user',
      phone: '+91 91234 56789',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    });

    console.log('👤 Created Users:');
    console.log('   👑 Admin: admin@imovies.com / admin123');
    console.log('   🎟️  User:  john@example.com / user123');

    // 2. Insert Movies
    const createdMovies = await Movie.insertMany(movies);
    console.log(`🎬 Seeded ${createdMovies.length} Bollywood & Blockbuster movies.`);

    // 3. Insert Theaters
    const createdTheaters = await Theater.insertMany(theaters);
    console.log(`🏛️  Seeded ${createdTheaters.length} Indian multiplex theaters.`);

    // 4. Create Shows for the next 4 days across all Indian theaters
    const showTimes = ['10:00 AM', '01:30 PM', '05:15 PM', '09:00 PM'];
    const nowShowingMovies = createdMovies.filter((m) => m.status === 'NOW_SHOWING');
    let showsCount = 0;

    const showsToInsert = [];

    // Schedule for today and next 3 days
    for (let dayOffset = 0; dayOffset < 4; dayOffset++) {
      const showDate = new Date();
      showDate.setDate(showDate.getDate() + dayOffset);
      showDate.setHours(0, 0, 0, 0);

      for (const theater of createdTheaters) {
        // Assign 2 to 3 movies per theater per day
        for (let i = 0; i < nowShowingMovies.length; i++) {
          const movie = nowShowingMovies[i];
          const time = showTimes[(i + dayOffset) % showTimes.length];

          const pricing = {
            regular: 220,
            premium: 350,
            vip: 550
          };

          const seats = generateSeatLayout(pricing);

          // Mark a few demo seats as already booked for realistic effect
          if (seats.length > 15) {
            seats[5].isBooked = true;
            seats[6].isBooked = true;
            seats[18].isBooked = true;
          }

          showsToInsert.push({
            movie: movie._id,
            theater: theater._id,
            showDate,
            showTime: time,
            screenNumber: (i % 2) + 1,
            pricing,
            seats,
            totalSeats: seats.length,
            availableSeats: seats.filter((s) => !s.isBooked).length
          });
          showsCount++;
        }
      }
    }

    const createdShows = await Show.insertMany(showsToInsert);
    console.log(`🎟️  Created ${createdShows.length} scheduled shows across all Indian cities.`);

    // 5. Create a verified sample booking
    if (createdShows.length > 0) {
      const sampleShow = createdShows[0];
      const bookedSeats = ['C3', 'C4'];

      // Mark in show
      sampleShow.seats.forEach((s) => {
        if (bookedSeats.includes(s.seatNumber)) {
          s.isBooked = true;
          s.bookedBy = standardUser._id;
        }
      });
      await sampleShow.save();

      const ticketSubtotal = 350 * 2; // ₹700
      const convenienceFee = 50; // ₹25 x 2
      const tax = Number(((ticketSubtotal + convenienceFee) * 0.18).toFixed(2)); // ₹135
      const grandTotal = ticketSubtotal + convenienceFee + tax;

      await Booking.create({
        bookingId: `BK-IND-${Date.now().toString().slice(-6)}`,
        user: standardUser._id,
        show: sampleShow._id,
        movie: sampleShow.movie,
        theater: sampleShow.theater,
        seats: bookedSeats,
        ticketCount: bookedSeats.length,
        seatDetails: [
          { seatNumber: 'C3', type: 'premium', price: 350 },
          { seatNumber: 'C4', type: 'premium', price: 350 }
        ],
        ticketSubtotal,
        convenienceFee,
        tax,
        grandTotal,
        paymentMethod: 'UPI / QR',
        paymentStatus: 'PAID',
        paymentDetails: {
          transactionId: `UPI-TXN-${Date.now()}`,
          cardLast4: 'UPI-OK'
        },
        status: 'CONFIRMED',
        qrData: JSON.stringify({
          bookingId: `BK-IND-${Date.now().toString().slice(-6)}`,
          user: standardUser.name,
          seats: bookedSeats
        })
      });
      console.log('✅ Sample Indian UPI booking created successfully.');
    }

    console.log('🎉 Indian Locations & Bollywood Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
