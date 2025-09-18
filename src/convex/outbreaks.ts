import { v } from "convex/values";
import { query } from "./_generated/server";

// Get nearby outbreaks based on user location
export const getNearbyOutbreaks = query({
  args: {
    latitude: v.number(),
    longitude: v.number(),
    radius: v.optional(v.number()), // in kilometers, default 50km
  },
  handler: async (ctx, args) => {
    const radius = args.radius || 50;
    
    const outbreaks = await ctx.db
      .query("outbreaks")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Filter outbreaks within the specified radius
    const nearbyOutbreaks = outbreaks.filter(outbreak => {
      const distance = calculateDistance(
        args.latitude,
        args.longitude,
        outbreak.location.latitude,
        outbreak.location.longitude
      );
      return distance <= radius;
    });

    // Get disease information for each outbreak
    const outbreaksWithDiseases = await Promise.all(
      nearbyOutbreaks.map(async (outbreak) => {
        const disease = await ctx.db.get(outbreak.diseaseId);
        return {
          ...outbreak,
          disease,
        };
      })
    );

    return outbreaksWithDiseases;
  },
});

// Get nearby healthcare resources
export const getNearbyHealthcareResources = query({
  args: {
    latitude: v.number(),
    longitude: v.number(),
    type: v.optional(v.union(v.literal("hospital"), v.literal("clinic"), v.literal("pharmacy"), v.literal("testing_center"))),
    radius: v.optional(v.number()), // in kilometers, default 25km
  },
  handler: async (ctx, args) => {
    const radius = args.radius || 25;
    
    let query = ctx.db.query("healthcareResources").filter((q) => q.eq(q.field("isActive"), true));
    
    if (args.type) {
      query = query.filter((q) => q.eq(q.field("type"), args.type));
    }

    const resources = await query.collect();

    // Filter resources within the specified radius
    const nearbyResources = resources.filter(resource => {
      const distance = calculateDistance(
        args.latitude,
        args.longitude,
        resource.location.latitude,
        resource.location.longitude
      );
      return distance <= radius;
    });

    // Sort by distance
    return nearbyResources
      .map(resource => ({
        ...resource,
        distance: calculateDistance(
          args.latitude,
          args.longitude,
          resource.location.latitude,
          resource.location.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  },
});

// Get all diseases for reference
export const getAllDiseases = query({
  args: {},
  handler: async (ctx) => {
    const diseases = await ctx.db
      .query("diseases")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    return diseases;
  },
});

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in kilometers
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
