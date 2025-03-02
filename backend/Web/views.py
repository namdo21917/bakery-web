from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import render, get_object_or_404
from .models import *
from .serializers import *
from django.shortcuts import get_object_or_404



# {
#     "email": "test@example.com",
#     "password": "Password123!"
# }
@api_view(['POST'])
def login(request):
    """
    Đăng nhập người dùng, trả về JWT Token nếu xác thực thành công.
    """
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        # Xác thực người dùng
        try:
            user = User.objects.get(email=email)
            if user.check_password(password) and user.role == 'customer':
                customer = Customer.objects.get(user=user)
                cart = Cart.objects.get(customer = customer)
                # Tạo token nếu mật khẩu đúng
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'userID': user.id,
                    'email': user.email,
                    'username': user.username,
                    'role': user.role,
                    'phone' : user.phone_number,
                    'address': user.address,
                    'cart' : cart.total_product_type()
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Mật khẩu không chính xác.'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'Người dùng không tồn tại.'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Xem thông tin người dùng
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def userInfo(request):
    user = request.user  
    serializer = UserSerializer(user)  
    return Response(serializer.data)


@api_view(['POST'])
def register(request):
    """
    Đăng ký tài khoản cho khách hàng.
    """
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Đăng ký thành công!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Danh sách sản phẩm
@api_view(['GET'])
def get_products(request):
    try: 
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Không tìm thấy sản phẩm.'}, status=status.HTTP_404_NOT_FOUND)

# Chi tiet san pham
@api_view(['GET'])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk = pk)
        serializers = ProductSerializer(product)
        return Response(serializers.data)
    except Product.DoesNotExist:
        return Response({'error': 'Sản phẩm không tồn tại'}, status=404)

# Tạo mới sản phẩm
@api_view(['POST'])
def create_product(request):
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Sửa sản phẩm
@api_view(['PUT'])
def update_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Sản phẩm không tồn tại.'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ProductSerializer(product, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Xóa sản phẩm
@api_view(['DELETE'])
def delete_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
        product.delete()
        return Response({'message': 'Sản phẩm đã được xóa thành công.'}, status=status.HTTP_204_NO_CONTENT)
    except Product.DoesNotExist:
        return Response({'error': 'Sản phẩm không tồn tại.'}, status=status.HTTP_404_NOT_FOUND)
    
# Danh sách Category
@api_view(['GET'])
def get_categories(request):
    try: 
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    except Category.DoesNotExist:
        return Response({'error': 'Không tìm thấy danh mục.'}, status=status.HTTP_404_NOT_FOUND)

# Tạo mới Category
@api_view(['POST'])
def create_category(request):
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Sửa Category
@api_view(['PUT'])
def update_category(request, pk):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response({'error': 'Danh mục không tồn tại.'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = CategorySerializer(category, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Xóa Category
@api_view(['DELETE'])
def delete_category(request, pk):
    try:
        category = Category.objects.get(pk=pk)
        category.delete()
        return Response({'message': 'Danh mục đã được xóa thành công.'}, status=status.HTTP_204_NO_CONTENT)
    except Category.DoesNotExist:
        return Response({'error': 'Danh mục không tồn tại.'}, status=status.HTTP_404_NOT_FOUND)
    
    
# Danh sách đơn hàng
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def customer_orders(request):
    try:
        # Lấy customer từ user đang đăng nhập
        print(request.user)
        customer = Customer.objects.get(user = request.user)
        print(customer)

        # Lấy tất cả đơn hàng thuộc về customer này
        orders = Order.objects.filter(customer=customer).order_by('-created_at')

        # Serialize dữ liệu
        serializer = OrderSerializer(orders, many=True)
        return Response({"orders": serializer.data}, status=status.HTTP_200_OK)
    except Customer.DoesNotExist:
        return Response({'error': f'Người dùng {request.user} không có giỏ hàng'}, status=status.HTTP_404_NOT_FOUND)
    except AttributeError:
        return Response(
            {"detail": "Không tìm thấy thông tin khách hàng."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
# Tạo mới đơn hàng (Đã sửa lại cách đọc thông tin)
# {
#     "products": [
#         {"product": {"id": 1}, "quantity": 2},
#         {"product": {"id": 2}, "quantity": 1}
#     ],
#     "payment_method": 1,
#     "discount": 3,   (Có thể NULL)
#     "total_price": 85000,
#     "hovaten": "Nguyen Van A",    (Có thể NULL)
#     "sdt": "0123456789",  (Có thể NULL)
#     "email": "example@gmail.com", (Có thể NULL)
#     "diachi": "123 ABC Street"    (Có thể NULL)
# }


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        # Lấy thông tin khách hàng
        customer = Customer.objects.filter(user=request.user).first()
        if not customer:
            return Response({'error': 'Người dùng không phải là khách hàng.'}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data
        products_data = data.get('products', [])  # Danh sách sản phẩm bao gồm {id, quantity}
        payment_method_id = data.get('payment_method')
        total_price = data.get('total_price')
        customer_info = data.get('customerInfo', {})  # Lấy thông tin khách hàng
        
        # lấy mã giảm giá
        if 'discount' in data:
            discount_id = data.get('discount')
            try:
                discount = Discount.objects.get(id=discount_id)
            except Discount.DoesNotExist:
                return Response({'error': f'Mã giảm giá với ID {discount_id} không tồn tại.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            discount = None


        # Kiểm tra phương thức thanh toán
        try:
            payment = PaymentMethod.objects.get(id=payment_method_id)
        except PaymentMethod.DoesNotExist:
            return Response({'error': 'Phương thức thanh toán không hợp lệ.'}, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra danh sách sản phẩm
        if not products_data:
            return Response({'error': 'Danh sách sản phẩm không được để trống.'}, status=status.HTTP_400_BAD_REQUEST)

        # total_price = 0.0
        order_items = []

        # Duyệt qua danh sách sản phẩm để tính tổng giá và tạo danh sách tạm cho OrderItem
        for item_data in products_data:
            # Lấy thông tin sản phẩm và số lượng từ dữ liệu gửi lên
            product_data = item_data.get('product')
            if not product_data:
                return Response({'error': 'Thiếu thông tin sản phẩm.'}, status=status.HTTP_400_BAD_REQUEST)

            product_id = product_data.get('id')
            quantity = item_data.get('quantity', 1)

            # Kiểm tra xem product_id có hợp lệ không
            if not product_id:
                return Response({'error': 'Sản phẩm không có ID.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                return Response({'error': f'Sản phẩm với ID {product_id} không tồn tại.'}, status=status.HTTP_400_BAD_REQUEST)

            # Tính tổng giá trị
            # total_price += product.price * quantity
            
            
            # Lưu OrderItem vào danh sách tạm
            order_items.append({
                'product': product,
                'quantity': quantity,
                'total_value': product.price * quantity
            })

         # Trích xuất thông tin từ customerInfo
        hoVaTen = customer_info.get('hovaten')
        SDT = customer_info.get('sdt')
        diaChi = customer_info.get('diachi')

        # Tạo đơn hàng
        order_new = Order.objects.create(
            customer=customer,
            tongtien=total_price,
            hovaten = hoVaTen,
            sdt = SDT,
            email=data.get('email', customer.user.email),
            diachi = diaChi,
            status='Chờ xác nhận',
            payment_method=payment,
            discount=discount
        )

        # if discount != None and total_price >= discount.minimum:
        #     total_price -= (discount.discountvalue * total_price) / 100

        # else:
        #     order_new = Order.objects.create(
        #         customer=customer,
        #         tongtien=total_price,
        #         hovaten=data.get('hovaten', customer.user.username),
        #         sdt=data.get('sdt', customer.user.phone_number),
        #         email=data.get('email', customer.user.email),
        #         diachi=data.get('diachi', customer.user.address),
        #         status='Chờ xác nhận',
        #         payment_method=payment
        #     )
        

        # Tạo OrderItem cho từng sản phẩm và liên kết với Order
        for item in order_items:
            OrderItem.objects.create(
                order=order_new,
                product=item['product'],
                quantity=item['quantity'],
                total_value=item['total_value']
            )
            if item['product'] not in order_new.products.all():
                order_new.products.add(item['product'])

        # Serialize dữ liệu đơn hàng
        serializer = OrderSerializer(order_new)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        # Trả về lỗi chi tiết cho frontend
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# hủy đơn hàng

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def cancel_order(request, pk):
    try:
        order = Order.objects.get(pk=pk)
        if order.customer.user != request.user:
            return Response({'error': 'Bạn không có quyền hủy đơn hàng này.'}, status=status.HTTP_403_FORBIDDEN)
        if order.status != 'Chờ xác nhận':
            return Response({'error': 'Đơn hàng không thể hủy bây giờ.'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = 'Hủy'
        order.save()
        return Response({'message': 'Đơn hàng đã hủy thành công.'}, status=status.HTTP_200_OK)
    except Order.DoesNotExist:
        return Response({'error': 'Đơn hàng không tồn tại.'}, status=status.HTTP_404_NOT_FOUND)
    except AttributeError:
        return Response(
            {"detail": "Không tìm thấy thông tin khách hàng."},
            status=status.HTTP_400_BAD_REQUEST
        )

# đánh giá sản phẩm
# {
#     "product_id": 1,
#     "rating": 5
# }
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_product(request, pk):
    try:
        order = Order.objects.get(pk=pk)
        if order.customer.user!= request.user:
            return Response({'error': 'Bạn không có quyền đánh giá đơn hàng này.'}, status=status.HTTP_403_FORBIDDEN)
        if order.status!= 'Hoàn thành':
            return Response({'error': 'Đơn hàng không thể đánh giá bây giờ.'}, status=status.HTTP_400_BAD_REQUEST)
        product_id = request.data.get('product_id')
        product = Product.objects.get(id=product_id)
        rating = request.data.get('rating')
        customer = Customer.objects.get(user = request.user)
        if rating < 1 or rating > 5:
            return Response({'error': 'Đánh giá phải trong khoảng từ 1 đến 5.'}, status=status.HTTP_400_BAD_REQUEST)
        orderitem = OrderItem.objects.get(order=order, product=product)
        orderitem.rating = rating
        orderitem.save()
        
        return Response({
                    'message': 'Đánh giá đơn hàng thành công',
                    'người đánh giá': customer.user.username,
                    'sản phẩm' : product.id,
                    'đánh giá' : rating
                }, status=status.HTTP_200_OK)
    except Order.DoesNotExist:
        return Response({'error': 'Đơn hàng không tồn tại.'}, status=status.HTTP_404_NOT_FOUND)
    except Product.DoesNotExist:
        return Response({'error': 'Sản phẩm không tồn tại.'}, status=status.HTTP_404_NOT_FOUND)
    except OrderItem.DoesNotExist:
        return Response({'error': 'Đơn hàng hoặc sản phẩm không tồn tại.'}, status=status.HTTP_404_NOT_FOUND)
    except AttributeError:
        return Response(
            {"detail": "Không tìm thấy thông tin khách hàng."},
            status=status.HTTP_400_BAD_REQUEST
        )

# get giỏ hàng
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def customer_cart(request):
    try:
        # Lấy customer từ user đang đăng nhập
        customer = Customer.objects.get(user = request.user)
        print(customer)

        # Lấy tất cả đơn hàng thuộc về customer này
        cart = Cart.objects.filter(customer=customer)

        # Serialize dữ liệu
        serializer = CartSerializer(cart, many=True)
        
        return Response({"carts": serializer.data}, status=status.HTTP_200_OK)
    except Customer.DoesNotExist:
        return Response({'error': f'Người dùng {request.user} không có giỏ hàng'}, status=status.HTTP_400_BAD_REQUEST)
    except AttributeError:
        return Response(
            {"detail": "Không tìm thấy thông tin khách hàng."},
            status=status.HTTP_400_BAD_REQUEST
        )
        
# {
#     "product_id": 1,
#     "quantity": 2
# }
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    try:
        customer = Customer.objects.get(user=request.user)
        print(customer)
        
        cart, created = Cart.objects.get_or_create(customer=customer)
        
        data = request.data
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)
        
        if not product_id:
            return Response({'error': 'Products ID không được để trống'}, status=status.HTTP_400_BAD_REQUEST)

        product = get_object_or_404(Product, id=product_id)
        
        cart_item, item_created = CartItem.objects.get_or_create(cart=cart, product=product)
        
        if not item_created:
            cart_item.quantity += int(quantity)  # Cộng thêm số lượng mới vào số lượng hiện tại
        else:
            cart_item.quantity = int(quantity)  # Đặt số lượng theo số lượng yêu cầu
        cart_item.save()
        
        # Lưu lại giỏ hàng nếu chưa lưu
        cart.save()
        
        if product not in cart.products.all():
            cart.products.add(product)
        
        cart.total_value = sum(item.quantity * item.product.price for item in CartItem.objects.filter(cart=cart))
        cart.quantity = cart.total_product_type()
        cart.save()

        # Trả về giỏ hàng đã cập nhật
        return Response({
            'message': 'Thêm sản phẩm vào giỏ hàng thành công',
            'product': {
                'name': product.name,
                'quantity': cart_item.quantity
            }
        }, status=status.HTTP_200_OK)

    except Customer.DoesNotExist:
        return Response({'error': 'Khách hàng không tồn tại'}, status=status.HTTP_404_NOT_FOUND)
    except Product.DoesNotExist:
        return Response({'error': 'Sản phẩm không tồn tại'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# xóa sản phẩm khỏi giỏ hàng
# {
#     "product_id": 123
# }

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    try:
        customer = Customer.objects.get(user=request.user)

        cart = get_object_or_404(Cart, customer=customer)

        data = request.data
        product_id = data.get('product_id')

        if not product_id:
            return Response({'error': 'Products ID không được để trống'}, status=status.HTTP_400_BAD_REQUEST)

        # Lấy sản phẩm dựa trên product_id
        product = get_object_or_404(Product, id=product_id)

        # Kiểm tra xem sản phẩm có trong giỏ hàng hay không
        cart_item = CartItem.objects.filter(cart=cart, product=product).first()
        if not cart_item:
            return Response({'error': 'Không có sản phẩm nào trong giỏ hàng'}, status=status.HTTP_404_NOT_FOUND)

        # Xóa sản phẩm khỏi CartItem
        cart_item.delete()

        # Xóa sản phẩm khỏi danh sách products của giỏ hàng nếu tồn tại
        if product in cart.products.all():
            cart.products.remove(product)

        # Cập nhật tổng giá trị và số lượng sản phẩm trong giỏ
        cart.total_value = sum(item.quantity * item.product.price for item in CartItem.objects.filter(cart=cart))
        cart.quantity = cart.total_product_type()
        cart.save()

        # Trả về thông báo thành công
        return Response({
            'message': 'Xóa sản phẩm khỏi giỏ hàng thành công',
            'product': {
                'name': product.name
            }
        }, status=status.HTTP_200_OK)

    except Customer.DoesNotExist:
        return Response({'error': 'Khách hàng không tồn tại'}, status=status.HTTP_404_NOT_FOUND)
    except Product.DoesNotExist:
        return Response({'error': 'Sản phẩm không tồn tại'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
# thay đổi số lượng của sản phẩm trong giỏ hàng
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_product_quantity(request):
    try:
        customer = Customer.objects.get(user = request.user)
        
        cart = get_object_or_404(Cart, customer=customer)


        data = request.data
        product_id = data.get('product_id')
        new_quantity = data.get('quantity')

        if not product_id or not new_quantity:
            return Response({'error': 'Products ID và số lượng không được để trống'}, status=status.HTTP_400_BAD_REQUEST)

        product = get_object_or_404(Product, id=product_id)

        # Kiểm tra xem sản phẩm có trong giỏ hàng hay không
        cart_item = CartItem.objects.filter(cart=cart, product=product).first()
        if not cart_item:
            return Response({'error': 'Không có sản phẩm nào trong giỏ hàng'}, status=status.HTTP_404_NOT_FOUND)

        if cart_item:
            # Cập nhật số lượng mới cho mục giỏ hàng
            cart_item.quantity = int(new_quantity)
            cart_item.save()

            
            total_product_type = cart.total_product_type()

            return Response({
                'message': 'Số lượng sản phẩm đã được thay đổi thành công',
                'total_book_type': total_product_type,
                'product': {
                    'name': product.name,
                    'quantity': cart_item.quantity
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Giỏ hàng không có sản phẩm'}, status=status.HTTP_404_NOT_FOUND)

    except Customer.DoesNotExist:
        return Response({'error': 'Khách hàng không tồn tại'}, status=status.HTTP_404_NOT_FOUND)
    except Product.DoesNotExist:
        return Response({'error': 'Sản phẩm không tồn tại'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# lấy ra thông tin doanh nghiệp

@api_view(['GET'])
def get_business_info(request):
    try:
        business = BusinessInfo.objects.all()[0]
        return Response({
            'name': business.name,
            'address': business.address,
            'phone': business.phone,
            'zalo_link': business.zalo_link
            }, status=status.HTTP_200_OK)
    except BusinessInfo.DoesNotExist:
        return Response({'error': 'Thông tin doanh nghiệp không tồn tại'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# lấy ra danh sách mã giảm giá
# Trả về cả id
@api_view(['GET'])
def get_discount_codes(request):
    try:
        discount_codes = Discount.objects.all()
        return Response({
            'discount_codes': [
                {
                    'id':code.id,
                    'description': code.description,
                    'discountvalue': code.discountvalue,
                    'minimum': code.minimum
                    } for code in discount_codes
        ]}, status=status.HTTP_200_OK)
    except Discount.DoesNotExist:
        return Response({'error': 'Danh sách mã giảm giá không tồn tại'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# lấy ra các payment_method

from django.conf import settings
from django.core.files.storage import default_storage

@api_view(['GET'])
def get_payment_methods(request):
    try:
        payment_methods = PaymentMethod.objects.all()
        return Response({
            'payment_methods': [
                {
                    'id' : method.id,
                    'methodname': method.methodname,
                    'QRcode': method.QRcode.url if method.QRcode and default_storage.exists(method.QRcode.name) else None
                } for method in payment_methods
            ]
        }, status=status.HTTP_200_OK)
    except PaymentMethod.DoesNotExist:
        return Response({'error': 'Danh sách các payment_method không tồn tại'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
