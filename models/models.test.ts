// we'll be testing averything associated with our models
// here - middleware, instance methods, and recalculateAvgRating
import { Business, User, Review } from '.';
import addressToGeoData from '@/lib/addressToGeoData';
import {
  openDatabase,
  clearDatabase,
  closeDatabase,
} from '@/test-utils/mongoMemoryUtils';
import mocks from '@/test-utils/mockDbEntries';

// mock addressToGeoData
jest.mock('@/lib/addressToGeoData');
const mockATGD = addressToGeoData as jest.MockedFunction<
  typeof addressToGeoData
>;

describe('Mongoose models', () => {
  beforeAll(async () => {
    await openDatabase();
  });
  beforeEach(async () => {
    await clearDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('Businesses', () => {
    test('should create and read', async () => {
      mockATGD.mockResolvedValue(mocks.geoDataSuccess);
      // create
      const business = new Business(mocks.business1);
      await business.save();
      // read
      const result = await Business.find({});
      expect(result.length).toBe(1);
    });

    test('should update', async () => {
      mockATGD.mockResolvedValue(mocks.geoDataSuccess);

      const business = new Business(mocks.business1);
      await business.save();

      // update
      const bizToUpdate = await Business.findOne({});
      bizToUpdate.companyName = 'New Business Name';
      await bizToUpdate.save();
      const result = await Business.findOne({ _id: bizToUpdate._id });
      expect(result.companyName).toBe('New Business Name');
    });

    test('should delete', async () => {
      mockATGD.mockResolvedValue(mocks.geoDataSuccess);

      const business = new Business(mocks.business1);
      await business.save();

      // delete
      await Business.findByIdAndDelete(business._id);
      const result = await Business.find({});
      expect(result.length).toBe(0);
    });

    test('pre-save middleware should plug in lat & lng on save', async () => {
      mockATGD.mockResolvedValue(mocks.geoDataSuccess);

      const business = new Business(mocks.business1);
      await business.save();

      const result = await Business.findById(business._id);
      expect(result.location.coordinates[0]).toEqual(
        mocks.geoDataSuccess.longitude
      );
      expect(result.location.coordinates[1]).toEqual(
        mocks.geoDataSuccess.latitude
      );
    });
  });

  describe('Users', () => {
    test('should create and read', async () => {
      // create
      const user = new User(mocks.user);
      await user.save();
      // read
      const result = await User.find({});
      expect(result.length).toBe(1);
    });

    test('should update', async () => {
      const user = new User(mocks.user);
      await user.save();

      // update
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { userName: 'New Name' },
        { returnDocument: 'after' }
      );
      expect(updatedUser.userName).toBe('New Name');
    });

    test('should delete', async () => {
      const user = new User(mocks.user);
      await user.save();

      // delete
      await User.findByIdAndDelete(user._id);
      const result = await User.find({});
      expect(result.length).toBe(0);
    });

    test('password should hash and paswordConfirm should delete', async () => {
      const user = new User(mocks.user);
      await user.save();

      // retrieve it from db
      const result = await User.findOne({}).select(
        '+password +passwordConfirm'
      );
      expect(result.password).not.toBe(mocks.user.password);
      expect(result.passwordConfirm).toBeUndefined();
    });

    test("should throw an error if passwords don't match", async () => {
      const user = new User({
        ...mocks.user,
        password: 'password1',
        passwordConfirm: 'password2',
      });
      await expect(user.save()).rejects.toThrow('Passwords do not match');
    });

    test('password match function should work', async () => {
      const user = new User(mocks.user);
      await user.save();

      // retrieve it from db
      const result = await User.findOne({}).select('+password');

      // match passwords (correct and incorrect)
      const isMatch = await result.passwordMatch(
        mocks.user.password,
        result.password
      );
      const isNotMatch = await result.passwordMatch(
        'wrongPassword',
        result.password
      );
      expect(isMatch).toBe(true);
      expect(isNotMatch).toBe(false);
    });
  });

  describe('Reviews', () => {
    test('should create and read', async () => {
      // create business and user to grab id's from
      const business = new Business(mocks.business1);
      const user = new User(mocks.user);
      // create
      const review = new Review({
        ...mocks.review1,
        user: user._id,
        business: business._id,
      });
      await review.save();
      // read
      const result = await Review.find({});
      expect(result.length).toBe(1);
    });

    test('should update', async () => {
      // create business and user to grab id's from
      const business = new Business(mocks.business1);
      const user = new User(mocks.user);
      // create
      const review = new Review({
        ...mocks.review1,
        user: user._id,
        business: business._id,
      });
      await review.save();

      // update
      const reviewToUpdate = await Review.findOne({ _id: review._id });
      reviewToUpdate.rating = 1;
      await reviewToUpdate.save();
      const result = await Review.findOne({ _id: reviewToUpdate._id });
      expect(result.rating).toBe(1);
    });

    test('should delete', async () => {
      // create business and user to grab id's from
      const business = new Business(mocks.business1);
      const user = new User(mocks.user);
      // create
      const review = new Review({
        ...mocks.review1,
        user: user._id,
        business: business._id,
      });
      await review.save();

      // delete
      await Review.findByIdAndDelete(review._id);
      const result = await Review.find({});
      expect(result.length).toBe(0);
    });

    test('should populate user info on retrieval', async () => {
      // create business and user to grab id's from
      const business = new Business(mocks.business1);
      const user = new User(mocks.user);
      await user.save();
      // create
      const review = new Review({
        ...mocks.review1,
        user: user._id,
        business: business._id,
      });
      await review.save();

      const result = await Review.findOne({ _id: review._id });
      expect(result.user.userName).toBe(user.userName);
    });

    test('should update business rating on save', async () => {
      // create business and user to grab id's from
      const business = new Business(mocks.business1);
      await business.save();
      const user = new User(mocks.user);
      // create
      const review = new Review({
        ...mocks.review1,
        user: user._id,
        business: business._id,
      });
      await review.save();

      const result = await Business.findOne({ _id: business._id });
      expect(result.ratingAvg).toBe(review.rating);
      expect(result.ratingQty).toBe(1);
    });

    test('should update business rating to 4.5 when last review is deleted', async () => {
      // create business and user to grab id's from
      const business = new Business(mocks.business1);
      await business.save();
      const user = new User(mocks.user);
      // create
      const review = new Review({
        ...mocks.review1,
        user: user._id,
        business: business._id,
      });

      // save and delete the review
      await review.save();
      await Review.findByIdAndDelete(review._id);

      // save and update rating
      const result = await Business.findOne({ _id: business._id });
      console.log(result);
      expect(result.ratingAvg).toBe(4.5);
      expect(result.ratingQty).toBe(0);

      // delete review and check rating
    });

    test('should throw an error trying to save duplicate business/user combo', async () => {
      // create business and user to grab id's from
      const business = new Business(mocks.business1);
      const user = new User(mocks.user);
      // create
      const review1 = new Review({
        ...mocks.review1,
        user: user._id,
        business: business._id,
      });
      const review2 = new Review({
        ...mocks.review2,
        user: user._id,
        business: business._id,
      });

      await review1.save();
      await expect(review2.save()).rejects.toThrow();
    });
  });
});
