/** @format */

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/lib/api";
import { 
  User, Package, MapPin, CreditCard, Settings, Edit, Plus, 
  Mail, Phone, MapPin as MapPinIcon, Save, X, Loader2 
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  role: 'customer' | 'seller' | 'admin';
  address?: string;
  shopName?: string;
  shopDescription?: string;
  businessAddress?: string;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
}

const ProfilePage = () => {
  const { user: authUser, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  const [profileData, setProfileData] = useState<UserProfile>({
    id: '',
    fullName: '',
    email: '',
    mobileNumber: '',
    role: 'customer',
    address: '',
    shopName: '',
    shopDescription: '',
    businessAddress: '',
    createdAt: '',
    updatedAt: ''
  });

  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  // Fetch user profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProfile();
      if (response.success && response.data) {
        setProfileData(response.data.user);
      }
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch order history
  const fetchOrders = async () => {
    try {
      // TODO: Replace with actual orders API endpoint
      setOrderHistory([
        {
          id: "ORD-2024-001",
          date: "2024-01-15",
          status: "delivered",
          total: 204.97,
          items: 3,
        },
        {
          id: "ORD-2024-002",
          date: "2024-01-10",
          status: "shipped",
          total: 89.99,
          items: 1,
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  useEffect(() => {
    if (authUser) {
      setProfileData(authUser);
      fetchProfile();
      fetchOrders();
    }
  }, [authUser]);

  const handleSaveProfile = async () => {
    try {
      setUpdating(true);
      const response = await apiService.updateProfile({
        fullName: profileData.fullName,
        mobileNumber: profileData.mobileNumber,
        address: profileData.address,
        shopName: profileData.shopName,
        shopDescription: profileData.shopDescription,
        businessAddress: profileData.businessAddress,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        setIsEditing(false);
        // Update local storage with new data
        if (response.data?.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset to original data
    if (authUser) {
      setProfileData(authUser);
    }
    setIsEditing(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "shipped":
        return <Badge className="bg-blue-500">Shipped</Badge>;
      case "confirmed":
        return <Badge className="bg-yellow-500">Confirmed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading your profile...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">My Account</h1>
          
          {/* Profile Summary Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white text-xl">
                    {getInitials(profileData.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-foreground">{profileData.fullName}</h2>
                  <p className="text-muted-foreground flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {profileData.email}
                  </p>
                  <p className="text-muted-foreground flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {profileData.mobileNumber}
                  </p>
                  <Badge variant="outline" className="mt-2 capitalize">
                    {profileData.role}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        value={profileData.email}
                        disabled
                        className="pl-10"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">Mobile Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="mobileNumber"
                        value={profileData.mobileNumber}
                        onChange={(e) => setProfileData({...profileData, mobileNumber: e.target.value})}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {profileData.role === 'customer' && (
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="relative">
                        <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          id="address"
                          value={profileData.address || ''}
                          onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                          disabled={!isEditing}
                          className="pl-10 min-h-[100px]"
                          placeholder="Enter your complete address"
                        />
                      </div>
                    </div>
                  )}

                  {profileData.role === 'seller' && (
                    <>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="shopName">Shop Name</Label>
                        <Input
                          id="shopName"
                          value={profileData.shopName || ''}
                          onChange={(e) => setProfileData({...profileData, shopName: e.target.value})}
                          disabled={!isEditing}
                          placeholder="Your shop name"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="shopDescription">Shop Description</Label>
                        <Textarea
                          id="shopDescription"
                          value={profileData.shopDescription || ''}
                          onChange={(e) => setProfileData({...profileData, shopDescription: e.target.value})}
                          disabled={!isEditing}
                          className="min-h-[100px]"
                          placeholder="Describe your shop and products"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="businessAddress">Business Address</Label>
                        <div className="relative">
                          <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Textarea
                            id="businessAddress"
                            value={profileData.businessAddress || ''}
                            onChange={(e) => setProfileData({...profileData, businessAddress: e.target.value})}
                            disabled={!isEditing}
                            className="pl-10 min-h-[100px]"
                            placeholder="Enter your business address"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleSaveProfile} 
                      className="flex items-center"
                      disabled={updating}
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {updating ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  View your recent orders and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orderHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                    <p className="text-muted-foreground">Your order history will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orderHistory.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="font-semibold">Order #{order.id}</h3>
                            {getStatusBadge(order.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                            <p>{order.items} items • ${order.total.toFixed(2)}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Saved Addresses</CardTitle>
                  <CardDescription>
                    Manage your delivery addresses
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Address</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="addressName">Full Name</Label>
                        <Input id="addressName" placeholder="Full name" />
                      </div>
                      <div>
                        <Label htmlFor="addressPhone">Phone</Label>
                        <Input id="addressPhone" placeholder="Phone number" />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="streetAddress">Street Address</Label>
                        <Input id="streetAddress" placeholder="Street address" />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="City" />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input id="state" placeholder="State" />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input id="zipCode" placeholder="ZIP Code" />
                      </div>
                      <div>
                        <Label htmlFor="addressType">Address Type</Label>
                        <Input id="addressType" placeholder="Home, Work, etc." />
                      </div>
                      <div className="col-span-2 pt-4">
                        <Button className="w-full">Save Address</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {savedAddresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No saved addresses</h3>
                    <p className="text-muted-foreground">Add your first address to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedAddresses.map((address) => (
                      <div key={address.id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{address.type}</h3>
                            {address.isDefault && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                          </div>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>{address.name}</p>
                          <p>{address.address}</p>
                          <p>{address.city}, {address.state} {address.zipCode}</p>
                          <p>{address.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full md:w-auto">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full md:w-auto">
                    Enable Two-Factor Authentication
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                  <CardDescription>
                    Manage your account data and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full md:w-auto">
                    Download My Data
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={logout}
                    className="w-full md:w-auto"
                  >
                    Sign Out
                  </Button>
                  <Button variant="destructive" className="w-full md:w-auto">
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;