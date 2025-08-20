import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  decimal,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { user } from './auth-schema';

export const experienceLevelEnum = pgEnum('experience_level', [
  'beginner',
  'intermediate',
  'expert',
]);

export const ownershipTypeEnum = pgEnum('ownership_type', [
  'owned',
  'leased',
  'shared',
]);

export const soilTypeEnum = pgEnum('soil_type', [
  'clay',
  'sandy',
  'loam',
  'silt',
  'rocky',
]);

export const drainageTypeEnum = pgEnum('drainage_type', [
  'good',
  'moderate',
  'poor',
]);

export const cropTypeEnum = pgEnum('crop_type', [
  'paddy',
  'vegetables',
  'fruits',
  'spices',
  'other',
]);

export const seasonEnum = pgEnum('season', ['maha', 'yala', 'off_season']);

export const cycleStatusEnum = pgEnum('cycle_status', [
  'planned',
  'planted',
  'growing',
  'harvested',
  'failed',
]);

export const growthStageEnum = pgEnum('growth_stage', [
  'seedling',
  'tillering',
  'flowering',
  'maturation',
]);

export const healthStatusEnum = pgEnum('health_status', [
  'excellent',
  'good',
  'fair',
  'poor',
]);

export const dataSourceEnum = pgEnum('data_source', [
  'manual',
  'sensor',
  'api',
  'weather_station',
]);

export const qualityGradeEnum = pgEnum('quality_grade', [
  'premium',
  'standard',
  'low_grade',
]);

export const alertTypeEnum = pgEnum('alert_type', [
  'weather',
  'pest_disease',
  'market_price',
  'irrigation',
  'harvest',
  'general',
]);

export const alertSeverityEnum = pgEnum('alert_severity', [
  'info',
  'warning',
  'critical',
]);

export const queryPriorityEnum = pgEnum('query_priority', [
  'low',
  'medium',
  'high',
  'urgent',
]);

export const queryStatusEnum = pgEnum('query_status', [
  'open',
  'in_progress',
  'resolved',
  'closed',
]);

export const knowledgeCategoryEnum = pgEnum('knowledge_category', [
  'best_practices',
  'pest_control',
  'water_management',
  'fertilization',
  'harvesting',
  'soil_management',
  'general',
]);

export const languageEnum = pgEnum('language', ['en', 'si', 'ta']);

export const irrigationTypeEnum = pgEnum('irrigation_type', [
  'flood',
  'drip',
  'sprinkler',
  'manual',
]);

export const taskStatusEnum = pgEnum('task_status', [
  'scheduled',
  'completed',
  'skipped',
]);

export const pestDiseaseTypeEnum = pgEnum('pest_disease_type', [
  'pest',
  'disease',
]);

export const severityEnum = pgEnum('severity', [
  'low',
  'medium',
  'high',
  'critical',
]);

export const resourceCategoryEnum = pgEnum('resource_category', [
  'seed',
  'fertilizer',
  'pesticide',
  'equipment',
  'labor',
]);

export const unitTypeEnum = pgEnum('unit_type', [
  'kg',
  'liters',
  'hours',
  'pieces',
  'bags',
]);

export const farmingMethodEnum = pgEnum('farming_method', [
  'organic',
  'conventional',
  'integrated',
]);

export const districtEnum = pgEnum('district_enum', [
  'galle',
  'colombo',
  'mathara',
]);

export const provinceEnum = pgEnum('province_enum', ['southern', 'western']);

export const communicationChannelEnum = pgEnum('communication_channel', [
  'sms',
  'email',
  'whatsapp',
]);

export const cropPreferenceEnum = pgEnum('crop_preference', [
  'paddy',
  'vegetables',
  'fruits',
]);

export const suitableSeasonEnum = pgEnum('suitable_season', [
  'maha',
  'yala',
  'off_season',
]);

export const tagEnum = pgEnum('tag', [
  'beginner_friendly',
  'advanced',
  'seasonal',
]);

export const attachmentTypeEnum = pgEnum('attachment_type', [
  'image',
  'document',
  'video',
]);

export const photoTypeEnum = pgEnum('photo_type', [
  'field_photo',
  'pest_damage',
  'growth_stage',
]);

export type FarmingMethod = (typeof farmingMethodEnum.enumValues)[number];
export type CommunicationChannel =
  (typeof communicationChannelEnum.enumValues)[number];
export type CropPreference = (typeof cropPreferenceEnum.enumValues)[number];
export type SuitableSeason = (typeof suitableSeasonEnum.enumValues)[number];
export type Tag = (typeof tagEnum.enumValues)[number];
export type AttachmentType = (typeof attachmentTypeEnum.enumValues)[number];
export type PhotoType = (typeof photoTypeEnum.enumValues)[number];

export type FarmerLocation = {
  lat: number;
  lng: number;
  district: (typeof districtEnum.enumValues)[number];
  province: (typeof provinceEnum.enumValues)[number];
};

export type CommunicationChannels = 'sms' | 'email' | 'whatsapp';

export type FarmLocation = {
  lat: number;
  lng: number;
  address: string;
};

export type ParcelCoordinates = {
  coordinates: [number, number][];
  type: 'polygon';
};

export type CropCharacteristics = {
  yieldPotential: string;
  diseaseResistance: string[];
  waterRequirement: 'low' | 'medium' | 'high';
  fertilizerRequirement: 'low' | 'medium' | 'high';
};

export type YieldData = {
  expected: number;
  actual?: number;
};

export type CostData = {
  total: number;
  breakdown?: Record<string, number>;
};

export type TemperatureData = {
  min: number;
  max: number;
  avg: number;
};

export type IrrigationData = {
  duration: number;
  waterAmount?: number;
};

export type TreatmentRecord = {
  treatment: string;
  cost?: number;
  date?: string;
};

export type UsageRecord = {
  planned: number;
  actual?: number;
  cost: number;
};

export const farmers = pgTable('farmers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 255 }).unique(),
  phone: varchar('phone', { length: 20 }).notNull(),
  address: text('address'),
  location: jsonb('location').$type<FarmerLocation>(),
  experienceLevel: experienceLevelEnum('experience_level').default('beginner'),
  farmingMethods: jsonb('farming_methods')
    .$type<FarmingMethod[]>()
    .default([])
    .notNull(),
  communicationChannels: jsonb('communication_channels')
    .$type<CommunicationChannel[]>()
    .default(['sms'])
    .notNull(),
  cropPreferences: jsonb('crop_preferences')
    .$type<CropPreference[]>()
    .default([])
    .notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const farms = pgTable(
  'farms',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    farmerId: uuid('farmer_id')
      .notNull()
      .references(() => farmers.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    totalArea: decimal('total_area', { precision: 10, scale: 4 }).notNull(),
    ownershipType: ownershipTypeEnum('ownership_type').notNull(),
    location: jsonb('location').$type<FarmLocation>(),
    registrationNumber: varchar('registration_number', { length: 100 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    farmerIdIdx: index('farms_farmer_id_idx').on(table.farmerId),
  })
);

export const landParcels = pgTable(
  'land_parcels',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    farmId: uuid('farm_id')
      .notNull()
      .references(() => farms.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    area: decimal('area', { precision: 10, scale: 4 }).notNull(),
    gpsCoordinates: jsonb('gps_coordinates').$type<ParcelCoordinates>(),
    soilType: soilTypeEnum('soil_type'),
    soilPh: decimal('soil_ph', { precision: 3, scale: 1 }),
    drainageType: drainageTypeEnum('drainage_type'),
    waterSource: varchar('water_source', { length: 100 }),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    farmIdIdx: index('land_parcels_farm_id_idx').on(table.farmId),
  })
);

export const cropVarieties = pgTable('crop_varieties', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  cropType: cropTypeEnum('crop_type').notNull().default('paddy'),
  description: text('description'),
  growthPeriod: integer('growth_period').notNull(),
  characteristics: jsonb('characteristics').$type<CropCharacteristics>(),
  suitableSeasons: jsonb('suitable_seasons').$type<SuitableSeason[]>(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const cropCycles = pgTable(
  'crop_cycles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    parcelId: uuid('parcel_id')
      .notNull()
      .references(() => landParcels.id, { onDelete: 'cascade' }),
    varietyId: uuid('variety_id')
      .notNull()
      .references(() => cropVarieties.id),
    season: seasonEnum('season').notNull(),
    year: integer('year').notNull(),
    plantingDate: date('planting_date').notNull(),
    expectedHarvestDate: date('expected_harvest_date').notNull(),
    actualHarvestDate: date('actual_harvest_date'),
    status: cycleStatusEnum('status').default('planned'),
    yieldData: jsonb('yield_data').$type<YieldData>().notNull(),
    costData: jsonb('cost_data').$type<CostData>(),
    revenue: decimal('revenue', { precision: 12, scale: 2 }),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    parcelIdIdx: index('crop_cycles_parcel_id_idx').on(table.parcelId),
    varietyIdIdx: index('crop_cycles_variety_id_idx').on(table.varietyId),
    seasonYearIdx: index('crop_cycles_season_year_idx').on(
      table.season,
      table.year
    ),
  })
);

export const growthStages = pgTable(
  'growth_stages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cycleId: uuid('cycle_id')
      .notNull()
      .references(() => cropCycles.id, { onDelete: 'cascade' }),
    stageName: growthStageEnum('stage_name').notNull(),
    startDate: date('start_date').notNull(),
    endDate: date('end_date'),
    expectedDuration: integer('expected_duration'),
    healthStatus: healthStatusEnum('health_status').default('good'),
    observations: text('observations'),
    photos: jsonb('photos').$type<PhotoType[]>().default([]),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    cycleIdIdx: index('growth_stages_cycle_id_idx').on(table.cycleId),
  })
);

export const yieldPredictions = pgTable(
  'yield_predictions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cycleId: uuid('cycle_id')
      .notNull()
      .references(() => cropCycles.id, { onDelete: 'cascade' }),
    predictionDate: date('prediction_date').notNull(),
    predictedYield: decimal('predicted_yield', {
      precision: 10,
      scale: 2,
    }).notNull(),
    confidenceLevel: decimal('confidence_level', { precision: 5, scale: 2 }),
    factors: jsonb('factors').$type<{
      weather_score: number;
      soil_conditions: number;
      pest_risk: number;
      water_availability: number;
    }>(),
    modelVersion: varchar('model_version', { length: 50 }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    cycleIdIdx: index('yield_predictions_cycle_id_idx').on(table.cycleId),
    predictionDateIdx: index('yield_predictions_prediction_date_idx').on(
      table.predictionDate
    ),
  })
);

export const weatherData = pgTable(
  'weather_data',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    parcelId: uuid('parcel_id').references(() => landParcels.id, {
      onDelete: 'cascade',
    }),
    recordDate: date('record_date').notNull(),
    temperature: jsonb('temperature').$type<TemperatureData>(),
    humidity: decimal('humidity', { precision: 5, scale: 2 }),
    rainfall: decimal('rainfall', { precision: 8, scale: 2 }),
    windSpeed: decimal('wind_speed', { precision: 6, scale: 2 }),
    soilMoisture: decimal('soil_moisture', { precision: 5, scale: 2 }),
    dataSource: dataSourceEnum('data_source').default('manual'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    parcelIdIdx: index('weather_data_parcel_id_idx').on(table.parcelId),
    recordDateIdx: index('weather_data_record_date_idx').on(table.recordDate),
  })
);

export const marketPrices = pgTable(
  'market_prices',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cropType: varchar('crop_type', { length: 100 }).notNull(),
    variety: varchar('variety', { length: 255 }),
    market: varchar('market', { length: 255 }).notNull(),
    priceDate: date('price_date').notNull(),
    pricePerKg: decimal('price_per_kg', { precision: 8, scale: 2 }).notNull(),
    quality: qualityGradeEnum('quality').default('standard'),
    currency: varchar('currency', { length: 3 }).default('LKR'),
    dataSource: varchar('data_source', { length: 100 }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    cropTypeIdx: index('market_prices_crop_type_idx').on(table.cropType),
    priceDateIdx: index('market_prices_price_date_idx').on(table.priceDate),
    marketIdx: index('market_prices_market_idx').on(table.market),
  })
);

export const farmerQueries = pgTable(
  'farmer_queries',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    farmerId: uuid('farmer_id')
      .notNull()
      .references(() => farmers.id, { onDelete: 'cascade' }),
    subject: varchar('subject', { length: 500 }).notNull(),
    description: text('description').notNull(),
    category: varchar('category', { length: 100 }),
    priority: queryPriorityEnum('priority').default('medium'),
    status: queryStatusEnum('status').default('open'),
    assignedTo: varchar('assigned_to', { length: 255 }),
    response: text('response'),
    responseDate: timestamp('response_date'),
    attachments: jsonb('attachments').$type<AttachmentType[]>().default([]),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    farmerIdIdx: index('farmer_queries_farmer_id_idx').on(table.farmerId),
    statusIdx: index('farmer_queries_status_idx').on(table.status),
  })
);

export const alerts = pgTable(
  'alerts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    farmerId: uuid('farmer_id').references(() => farmers.id, {
      onDelete: 'cascade',
    }),
    type: alertTypeEnum('type').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    message: text('message').notNull(),
    severity: alertSeverityEnum('severity').default('info'),
    isRead: boolean('is_read').default(false),
    actionRequired: boolean('action_required').default(false),
    relatedEntity: jsonb('related_entity').$type<{
      type: string;
      id: string;
    }>(),
    validUntil: timestamp('valid_until'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    farmerIdIdx: index('alerts_farmer_id_idx').on(table.farmerId),
    typeIdx: index('alerts_type_idx').on(table.type),
    isReadIdx: index('alerts_is_read_idx').on(table.isRead),
  })
);

export const knowledgeBase = pgTable(
  'knowledge_base',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 500 }).notNull(),
    content: text('content').notNull(),
    category: knowledgeCategoryEnum('category').notNull(),
    cropType: varchar('crop_type', { length: 100 }),
    tags: jsonb('tags').$type<Tag[]>().default([]),
    language: languageEnum('language').default('en'),
    author: varchar('author', { length: 255 }),
    isPublished: boolean('is_published').default(true),
    viewCount: integer('view_count').default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    categoryIdx: index('knowledge_base_category_idx').on(table.category),
    cropTypeIdx: index('knowledge_base_crop_type_idx').on(table.cropType),
    languageIdx: index('knowledge_base_language_idx').on(table.language),
  })
);

export const irrigationSchedules = pgTable(
  'irrigation_schedules',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cycleId: uuid('cycle_id')
      .notNull()
      .references(() => cropCycles.id, { onDelete: 'cascade' }),
    scheduledDate: timestamp('scheduled_date').notNull(),
    irrigationType: irrigationTypeEnum('irrigation_type').default('manual'),
    irrigationData: jsonb('irrigation_data').$type<IrrigationData>().notNull(),
    status: taskStatusEnum('status').default('scheduled'),
    actualDate: timestamp('actual_date'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    cycleIdIdx: index('irrigation_schedules_cycle_id_idx').on(table.cycleId),
    scheduledDateIdx: index('irrigation_schedules_scheduled_date_idx').on(
      table.scheduledDate
    ),
  })
);

export const pestDiseaseRecords = pgTable(
  'pest_disease_records',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cycleId: uuid('cycle_id')
      .notNull()
      .references(() => cropCycles.id, { onDelete: 'cascade' }),
    type: pestDiseaseTypeEnum('type').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    severity: severityEnum('severity').notNull(),
    affectedArea: decimal('affected_area', { precision: 8, scale: 4 }),
    identificationDate: date('identification_date').notNull(),
    symptoms: text('symptoms'),
    treatmentRecord: jsonb('treatment_record').$type<TreatmentRecord>(),
    isResolved: boolean('is_resolved').default(false),
    photos: jsonb('photos').$type<PhotoType[]>().default([]),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    cycleIdIdx: index('pest_disease_records_cycle_id_idx').on(table.cycleId),
    typeIdx: index('pest_disease_records_type_idx').on(table.type),
  })
);

export const resources = pgTable(
  'resources',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    category: resourceCategoryEnum('category').notNull(),
    unit: unitTypeEnum('unit').notNull(),
    costPerUnit: decimal('cost_per_unit', { precision: 10, scale: 2 }),
    supplier: varchar('supplier', { length: 255 }),
    description: text('description'),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    categoryIdx: index('resources_category_idx').on(table.category),
  })
);

export const resourceUsage = pgTable(
  'resource_usage',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cycleId: uuid('cycle_id')
      .notNull()
      .references(() => cropCycles.id, { onDelete: 'cascade' }),
    resourceId: uuid('resource_id')
      .notNull()
      .references(() => resources.id),
    usageData: jsonb('usage_data').$type<UsageRecord>().notNull(),
    usageDate: date('usage_date'),
    purpose: varchar('purpose', { length: 255 }),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    cycleIdIdx: index('resource_usage_cycle_id_idx').on(table.cycleId),
    resourceIdIdx: index('resource_usage_resource_id_idx').on(table.resourceId),
  })
);

export const farmersRelations = relations(farmers, ({ many }) => ({
  farms: many(farms),
  queries: many(farmerQueries),
  alerts: many(alerts),
}));

export const farmsRelations = relations(farms, ({ one, many }) => ({
  farmer: one(farmers, {
    fields: [farms.farmerId],
    references: [farmers.id],
  }),
  parcels: many(landParcels),
}));

export const landParcelsRelations = relations(landParcels, ({ one, many }) => ({
  farm: one(farms, {
    fields: [landParcels.farmId],
    references: [farms.id],
  }),
  cropCycles: many(cropCycles),
  weatherData: many(weatherData),
}));

export const cropVarietiesRelations = relations(cropVarieties, ({ many }) => ({
  cropCycles: many(cropCycles),
}));

export const cropCyclesRelations = relations(cropCycles, ({ one, many }) => ({
  parcel: one(landParcels, {
    fields: [cropCycles.parcelId],
    references: [landParcels.id],
  }),
  variety: one(cropVarieties, {
    fields: [cropCycles.varietyId],
    references: [cropVarieties.id],
  }),
  growthStages: many(growthStages),
  yieldPredictions: many(yieldPredictions),
  irrigationSchedules: many(irrigationSchedules),
  pestDiseaseRecords: many(pestDiseaseRecords),
  resourceUsage: many(resourceUsage),
}));

export const growthStagesRelations = relations(growthStages, ({ one }) => ({
  cropCycle: one(cropCycles, {
    fields: [growthStages.cycleId],
    references: [cropCycles.id],
  }),
}));

export const yieldPredictionsRelations = relations(
  yieldPredictions,
  ({ one }) => ({
    cropCycle: one(cropCycles, {
      fields: [yieldPredictions.cycleId],
      references: [cropCycles.id],
    }),
  })
);

export const weatherDataRelations = relations(weatherData, ({ one }) => ({
  parcel: one(landParcels, {
    fields: [weatherData.parcelId],
    references: [landParcels.id],
  }),
}));

export const farmerQueriesRelations = relations(farmerQueries, ({ one }) => ({
  farmer: one(farmers, {
    fields: [farmerQueries.farmerId],
    references: [farmers.id],
  }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  farmer: one(farmers, {
    fields: [alerts.farmerId],
    references: [farmers.id],
  }),
}));

export const irrigationSchedulesRelations = relations(
  irrigationSchedules,
  ({ one }) => ({
    cropCycle: one(cropCycles, {
      fields: [irrigationSchedules.cycleId],
      references: [cropCycles.id],
    }),
  })
);

export const pestDiseaseRecordsRelations = relations(
  pestDiseaseRecords,
  ({ one }) => ({
    cropCycle: one(cropCycles, {
      fields: [pestDiseaseRecords.cycleId],
      references: [cropCycles.id],
    }),
  })
);

export const resourcesRelations = relations(resources, ({ many }) => ({
  usage: many(resourceUsage),
}));

export const resourceUsageRelations = relations(resourceUsage, ({ one }) => ({
  cropCycle: one(cropCycles, {
    fields: [resourceUsage.cycleId],
    references: [cropCycles.id],
  }),
  resource: one(resources, {
    fields: [resourceUsage.resourceId],
    references: [resources.id],
  }),
}));

export type Farmer = typeof farmers.$inferSelect;
export type NewFarmer = typeof farmers.$inferInsert;
export type Farm = typeof farms.$inferSelect;
export type NewFarm = typeof farms.$inferInsert;
export type LandParcel = typeof landParcels.$inferSelect;
export type NewLandParcel = typeof landParcels.$inferInsert;
export type CropVariety = typeof cropVarieties.$inferSelect;
export type NewCropVariety = typeof cropVarieties.$inferInsert;
export type CropCycle = typeof cropCycles.$inferSelect;
export type NewCropCycle = typeof cropCycles.$inferInsert;
export type GrowthStage = typeof growthStages.$inferSelect;
export type NewGrowthStage = typeof growthStages.$inferInsert;
export type YieldPrediction = typeof yieldPredictions.$inferSelect;
export type NewYieldPrediction = typeof yieldPredictions.$inferInsert;
export type WeatherData = typeof weatherData.$inferSelect;
export type NewWeatherData = typeof weatherData.$inferInsert;
export type MarketPrice = typeof marketPrices.$inferSelect;
export type NewMarketPrice = typeof marketPrices.$inferInsert;
export type FarmerQuery = typeof farmerQueries.$inferSelect;
export type NewFarmerQuery = typeof farmerQueries.$inferInsert;
export type Alert = typeof alerts.$inferSelect;
export type NewAlert = typeof alerts.$inferInsert;
export type KnowledgeBase = typeof knowledgeBase.$inferSelect;
export type NewKnowledgeBase = typeof knowledgeBase.$inferInsert;
export type IrrigationSchedule = typeof irrigationSchedules.$inferSelect;
export type NewIrrigationSchedule = typeof irrigationSchedules.$inferInsert;
export type PestDiseaseRecord = typeof pestDiseaseRecords.$inferSelect;
export type NewPestDiseaseRecord = typeof pestDiseaseRecords.$inferInsert;
export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;
export type ResourceUsage = typeof resourceUsage.$inferSelect;
export type NewResourceUsage = typeof resourceUsage.$inferInsert;
