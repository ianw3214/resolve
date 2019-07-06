#include "widget.hpp"

#include "core/engine.hpp"

Widget::Widget(const std::string& name, int x, int y) : name(name), x(x), y(y), draw_x(x), draw_y(y) {}
Widget::~Widget() {
    for (Component * component : render_parts) {
        delete component;
    }
    render_parts.clear();
}

void Widget::add_h_padding(int padding) {
    draw_x += padding;
}

void Widget::add_v_padding(int padding) {
    draw_y += padding;
}

void Widget::new_line() {
    draw_x = x;
    // TODO: No magic numbers
    draw_y += 16;
}


// TODO: Custom colours
void Widget::draw_text(const std::string& text) {
    render_parts.push_back(new TextComponent(text));
    new_line();
}

void Widget::draw_image(std::string& tex, int w, int h, const Rect& src) {
    render_parts.push_back(new ImageComponent(tex, w, h, src));
    add_h_padding(w);
}

void Widget::draw_image(std::string& tex, int w, int h, const Rect& src, std::function<void()> f) {
    render_parts.push_back(new ImageComponent(tex, w, h, src));
    click_parts.push_back({{draw_x, draw_y, w, h}, f});
    add_h_padding(w);
}

bool Widget::click(int mouse_x, int mouse_y) {
    // See if anything that should have been clicked on was clicked
    for (const ClickData& data : click_parts) {
        if (mouse_x > data.area.x && mouse_x < data.area.x + data.area.w 
            && mouse_y > data.area.y && mouse_y < data.area.y + data.area.h) 
        {
            data.callback();
        }
    }
    return false;
}

void Widget::render() {
    for (const Component* component : render_parts) {
        if (component->type == ComponentType::TEXT) {
            TextComponent text = *(dynamic_cast<const TextComponent*>(component));
            // TODO: Cache this maybe
            // TODO: No magic numbers
            Texture tex(QcE::get_instance()->getTextEngine()->getTexture(text.text, "widgets", {255, 255, 255, 255}));
            tex.render(draw_x, draw_y - 4); // NOT SURE WHY THIS IS NEEDED
            new_line();
        }
        if (component->type == ComponentType::IMAGE) {
            ImageComponent img = *(dynamic_cast<const ImageComponent*>(component));
            Texture * tex = QcE::get_instance()->loadTexture(img.texture, img.texture);
            tex->setSource(img.source.x, img.source.y, img.source.w, img.source.h);
            tex->render(draw_x, draw_y, img.w, img.h);
            add_h_padding(img.w);
        }
    }
    resetDrawPos();
}

void Widget::resetDrawPos() {
    draw_x = x;
    draw_y = y;
}